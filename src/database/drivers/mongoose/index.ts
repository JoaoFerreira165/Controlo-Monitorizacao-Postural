import mongoose from 'mongoose';
import chalk from 'chalk';

export const mongodbConnection = async () => {
  try{
    mongoose.set('strictQuery', false); // Se o strictQuery for true, sempre que passado no deleteMany uma propriedade de 
                                        // um objecto que não existe, o mongoose apanha todos os objectos na DB
    await mongoose.connect('mongodb://127.0.0.1:27017/dbAppacdm');
    console.log(`[${chalk.magentaBright('DB')}][${chalk.blueBright('INFO')}] Connected to MongoDB`);
  }catch(err){
    console.error(err);
  } 
}