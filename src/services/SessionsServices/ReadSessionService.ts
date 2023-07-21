import { Request, Response } from 'express';
import { ISession } from '../../database/drivers/mongoose/model/Sessions';
import { ISessionData } from '../../database/drivers/mongoose/model/Sessions_Data';
import { Types, Schema, ObjectId }  from 'mongoose';
import SessionsRepository from "../../database/drivers/mongoose/repositories/SessionsRepository";

import AppExcepiton from '../../errors/AppException';

const JSONStream  = require('JSONStream');

import { Transform, transforms } from 'json2csv';

const  { Readable } = require('stream');

var streamify = require('stream-array')

class ReadSessionService{
    private SessionsRepository;

    constructor(){
        this.SessionsRepository = new SessionsRepository();
    }

    
    public async all(): Promise<ISession[] | null>{
        let sessions: ISession[] | null;

        try{
            sessions = await this.SessionsRepository.filterAllSessions();
        }catch (error){
            throw new AppExcepiton('Error filter all sessions');
        }

        return sessions;
    }

    public async byId(id: string): Promise<ISession | null>{
        let session: ISession | null;

        try{
            session = await this.SessionsRepository.filterSessionById(
                id
            );
        }catch (error){
            throw new AppExcepiton('Error filter session by id');
        }

        if(!session)
            throw new AppExcepiton('Session ID does not exist');


        return session;
    }

    public async sesssionDatabyId(response: Response, ids: string[]): Promise<ISessionData[] | null | any>{
        let sessionData: any = null;
        let objectIds: Types.ObjectId[] = [];

        try {
            ids.forEach(element => {
                objectIds.push(new Types.ObjectId(element));
            });
        } catch (error) {
            throw new AppExcepiton('Error convert ids');
        }
        
        try{
            let sessions = await this.SessionsRepository.filterSessionsByIds(objectIds)

            if(!sessions)
                throw new AppExcepiton('Session ID does not exist');

            for(const element of sessions){
                element["data_session"] = [];
                element["data_session"].push(await this.SessionsRepository.filterSessionDataBySessionId_test(element["_id"]));
            }
           
            return sessions;
            
            // const cursor = this.SessionsRepository.filterSessionDataBySessionId(objectIds);
            
            // sessions[0]["data_session"] = [];
            // let executed = true;

            // ---------> map!

            // cursor.map((doc) => {
            //     if(doc.sessionId == ){
            //         sessions[0]["data_session"] = [];
            //         sessions[0]["data_session"].push(doc);
            //         return sessions[0]["data_session"]
            //     }
            // });

            // ---------> eachAsync!

            // cursor.eachAsync(async (doc: any) =>{
            //     // if(executed){
            //     //     executed = false;
            //     //     sessions[0]["data_session"].push(doc);
            //     //     return sessions[0];
            //     // }
                
            //     if(doc.sessionId == "62bc39d150502def804c5b73"){
            //         console.log(doc.sessionId);
            //         sessions[0]["data_session"].push(doc);
            //         //return sessions[0];
            //     }
            // });  


            // ---------> NEXT!

            // let doc: any = await cursor.next();

            // while (doc != null) {
            //     // Do something with the user
            //     if(doc.sessionId == "62bc39d150502def804c5b73"){
            //         //sessions[0]["data_session"] = [];
            //         doc["sessionId"] = '62bc39d150502def804c5b73';
            //         await doc.save();
            //     }
                
            //     // Get the next user in the result set
            //     doc = await cursor.next();
            // }

            //return cursor.pipe(JSONStream.stringify())
        }catch (error){
            console.log(error);
            throw new AppExcepiton('Error filter session data by id');
        }
    }
    
    public async exportSessionsByIds(response: Response, format: string, ids: string[]): Promise<any>{
        let objectIds: Types.ObjectId[] = [];

        if(!ids.length)
            throw new AppExcepiton('No id was passed');

        try {
            ids.forEach(element => {
                objectIds.push(new Types.ObjectId(element));
            });  
        } catch (error) {
            throw new AppExcepiton('Error convert ids');
        }

        if(format != "csv" && format != "json")
            throw new AppExcepiton('Invalid requested format');

    }

    public async exportSessionsByTimeRange(response: Response,format: string, start_time: string, end_time: string ): Promise<any>{
        let start: Date;
        let end: Date;

        try {
            start = new Date(start_time);
            end = new Date(end_time);
        } catch (error) {
            throw new AppExcepiton('Error convert dates');
        }

        if(format != "csv" && format != "json")
            throw new AppExcepiton('Invalid requested format');

        
        //const writeStream = fs.createWriteStream(path.join(__dirname, '../../../', '/tmp/sessions_data', `test.${format}`));
 
        if(format == "json"){
            response.setHeader('Content-Type', "application/json");
            response.setHeader('Content-Disposition', `attachment; filename="${start_time}-${end_time}.${format}"`);

            try{ 
                return this.SessionsRepository.filterSessionsByTimeRange(
                    start,
                    end
                ).pipe(JSONStream.stringify());
            }catch(error){
                throw new AppExcepiton('Error generating json');
            }
        }else if(format == 'csv'){
            response.setHeader('Content-Type', "application/csv");
            response.setHeader('Content-Disposition', `attachment; filename="${start_time}-${end_time}.${format}"`);

            const fields = ['_id', 'task.name', 'patient.name','createdAt', 'endAt', 'session_data.data.pitchRotation', 'session_data.data.rollRotation', 'session_data.data.yawRotation', 'session_data.createdAt'];
            const transformsUnwind = [transforms.unwind({ paths: ['session_data', 'patient'] })];
        
            const json2csv = new Transform({ 
                fields, transforms: transformsUnwind
            });

            try{
                return this.SessionsRepository.filterSessionsByTimeRange(
                    start,
                    end
                ).pipe(JSONStream.stringify())
                 .pipe(json2csv);
            }catch(error){
                throw new AppExcepiton('Error generating csv');
            }    
        }
    }

    public async unfinishedSessions(): Promise<ISession[]>{
        let session: ISession[];

        try{
            session = await this.SessionsRepository.filterSessionsBySingleProperty("endAt", "");
        }catch (error){
            throw new AppExcepiton(`Error filter session unfinished`);
        }

        if(!session)
            throw new AppExcepiton('There are no sessions running');

        return session;
    }
}

export default new ReadSessionService();