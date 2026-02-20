import { config } from "dotenv";

config({path: `.env.${process.env.NODE_ENV || 'development'}.local`})

export const { 
    PORT, 
    NODE_ENV,
    PARMS_DB_URI,
    IBMS_DB_URI,
    HRMS_DB_URI
} = process.env