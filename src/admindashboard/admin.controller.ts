import { Controller, Get } from "@nestjs/common";
import { AdminServices } from "./admin.service";

@Controller('admindashboard')
export class AdminDashboardController{
    constructor (private readonly adminService:AdminServices){}

    @Get('/get')
    async getDashboardData(){
        return this.adminService.getDataInDashboard()
    }

    @Get('/get/trafic')
    async getTrafica(){
        return this.adminService.getTraficHabitStatusMonthData()
    }
}