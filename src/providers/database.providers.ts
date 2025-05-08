import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'Llampa20',
        database: 'globaltec',
        // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        // synchronize: true, // ⚠️ Solo en desarrollo (puede borrar datos)
      });

      await dataSource.initialize();
      console.log(dataSource, 'dfsfsd');

      return dataSource;
    },
  },
];
