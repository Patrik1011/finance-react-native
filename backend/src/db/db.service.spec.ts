import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { DbService } from './db.service';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

describe('DbService', () => {
  let service: DbService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DbService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'DB_HOST':
                  return 'localhost';
                case 'DB_PORT':
                  return 5432;
                case 'DB_USERNAME':
                  return 'testuser';
                case 'DB_PASSWORD':
                  return 'testpassword';
                case 'DB_NAME':
                  return 'testdb';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<DbService>(DbService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create TypeOrm options', () => {
    const options: TypeOrmModuleOptions = service.createTypeOrmOptions();
    expect(options).toEqual({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'testuser',
      password: 'testpassword',
      database: 'testdb',
      autoLoadEntities: true,
      synchronize: true,
    });
  });
});
