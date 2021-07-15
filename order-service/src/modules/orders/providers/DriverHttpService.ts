import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config'
import got from 'got'

export interface IDriver {
  id: number,
  uuid: string,
  name: string
}

@Injectable()
export class DriverHttpService {
  constructor(private readonly config: ConfigService) {}

  fetchAllDrivers(): Promise<IDriver[]> {
    return got.get(this.config.get('DRIVER_URL') + '/drivers').json()
  }

  fetchDriverById(id): Promise<IDriver> {
    return got.get(this.config.get('DRIVER_URL') + '/drivers/' + id).json()
  }
}