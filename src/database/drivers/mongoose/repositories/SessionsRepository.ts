import SessionsData, { ISessionData, IData } from '../model/Sessions_Data';
import Session, { ISession } from '../model/Sessions';

import { IUpdateSession, ISessionRequestWithId } from '../../../../interfaces'
import { Cursor, Types } from 'mongoose';

class SessionsRepository {
  
  private sessionsDataRepository;
  private sessionsRepository;
  
  constructor() {
    this.sessionsDataRepository = SessionsData;
    this.sessionsRepository = Session;
  }
  
  // Session Data Repository
  public async storeSessionData({ sessionId, data }: ISessionData): Promise<ISessionData> {
    return await this.sessionsDataRepository.create({
      sessionId,
      data
    });
  }
  
  public async filterSessionDataBySessionId_test(id: Types.ObjectId): Promise<ISessionData[]>{
    return await this.sessionsDataRepository.find({
      sessionId: id
    });
  }

  public filterSessionDataBySessionId(ids: Types.ObjectId[]): Cursor<ISessionData>{
    return this.sessionsDataRepository.aggregate([
      {
        '$match': {
          'sessionId': {
            '$in': ids
          }
        }
      }
    ]).cursor()
  }
  
  // Session Repository
  public async createSession({ description, task, patient, device, complex }: ISession): Promise<ISession> {
    return await this.sessionsRepository.create({
      description,
      task,
      patient,
      device,
      complex
    });
  }
  
  public async filterAllSessions(): Promise<ISession[] | null> {
    return await this.sessionsRepository.find().populate(["task", 
    {
      path: 'patient',
      populate: {
        path: 'complex',
        select:{
          'name': 1
        }
      },
    },
    {
      path: 'device',
      populate: {
        path: 'complex',
        select:{
          'name': 1
        }
      }
    },
    ]);
  }

  public async filterSessionById(id: string): Promise<ISession | null> {
    return await this.sessionsRepository.findById(
      id
      ).populate({
        path: 'patient',
        populate: {
          path: 'complex'
        }
      }
      ).populate("task");
  }
    
  public async filterSessionsBySingleProperty(property: string, value: any): Promise<ISession[]> {
    return await this.sessionsRepository.find({
      [property]: value
    });
  }
    
  public async filterPatientSessionsByTimeRange(patientId: string, start_time: Date, end_time: Date): Promise<ISession[]> {
    return await this.sessionsRepository.find({
      patient: patientId,
      createdAt: {
        $gte: start_time,
        $lt: end_time
      }
    })
  }
    
  public filterSessionsByIds(ids: Types.ObjectId[]): any{
    return this.sessionsRepository.aggregate([
      {
        '$match': {
          '_id': {
            '$in': ids
          }
        }
      }, {
        '$lookup': {
          'from': 'patients', 
          'localField': 'patient', 
          'foreignField': '_id', 
          'as': 'patient'
        }
      }, {
        '$lookup': {
          'from': 'tasks', 
          'localField': 'task', 
          'foreignField': '_id', 
          'as': 'task'
        }
      }, {
        '$lookup': {
          'from': 'devices', 
          'localField': 'device', 
          'foreignField': '_id', 
          'as': 'device'
        }
      }, {
        '$unwind': {
          'path': '$task'
        },
      }, {
        '$lookup': {
          'from': 'complex', 
          'localField': 'patient.complex', 
          'foreignField': '_id', 
          'as': 'complex'
        }
      }, {
        '$unwind': {
          'path': '$complex'
        }
      }, {
        '$project': {
          'updatedAt': 0, 
          'device.password': 0
        }
      }
    ]);
  }
    
  public filterSessionsByTimeRange(start_time: Date, end_time: Date): Cursor<ISession[]> {
    return this.sessionsRepository.aggregate([
      {
        '$match': {
          'createdAt': {
            '$gte': start_time, 
            '$lte': end_time
          }
        }
      }, {
        '$lookup': {
          'from': 'patients', 
          'localField': 'patient', 
          'foreignField': '_id', 
          'as': 'patient'
        }
      }, {
        '$lookup': {
          'from': 'tasks', 
          'localField': 'task', 
          'foreignField': '_id', 
          'as': 'task'
        }
      }, {
        '$lookup': {
          'from': 'devices', 
          'localField': 'device', 
          'foreignField': '_id', 
          'as': 'device'
        }
      }, {
        '$unwind': {
          'path': '$task'
        }
      }, {
        '$lookup': {
          'from': 'complex', 
          'localField': 'patient.complex', 
          'foreignField': '_id', 
          'as': 'complex'
        }
      }, {
        '$unwind': {
          'path': '$complex'
        }
      }, {
        '$lookup': {
          'from': 'sessions_data', 
          'localField': '_id', 
          'foreignField': 'sessionId', 
          'as': 'session_data'
        }
      }, {
        '$project': {
          'updatedAt': 0, 
          'device.password': 0, 
          'session_data.updatedAt': 0
        }
      }
    ]).cursor();
  }
    
  public async updateSessionById({ id, description, task, patient, deviceName, endAt }: IUpdateSession): Promise<ISession | null> {
    return await this.sessionsRepository.findByIdAndUpdate({
      _id: id, 
    },
    {
      id,
      description,
      task,
      patient,
      deviceName,
      endAt
    },
    {
      new: true,
    }
    );
  }
    
  public async deleteSessionByField(field: string, value: string): Promise<any> {
    return await this.sessionsRepository.deleteMany({
      [field]: value
    });
  }      
}

export default SessionsRepository;