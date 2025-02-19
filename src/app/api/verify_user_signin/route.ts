import { BigQuery } from '@google-cloud/bigquery';
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
    try {
        const email = request.nextUrl.searchParams.get('email');
        const password = request.nextUrl.searchParams.get('password');
        

        if (!email || !password) {
            return new NextResponse(
                JSON.stringify({ error: 'Email and password are required' }),
                { 
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            )
        }

        const bigquery = new BigQuery({});
        const query = "select * from  `drawingfire-b72a8.auth.NEXTJS_WEB_APP_USERS`  where email = @email";
        const options = {
            query,
            parameterMode: 'named',
            params: { email }
        };
        
        const [job] = await bigquery.createQueryJob(options);
        const [rows] = await job.getQueryResults();
        
        if (!rows || rows.length === 0) {
            return new NextResponse(
                JSON.stringify({ isPasswordValid: false }),
                { 
                    status: 401,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            )
        }

        const userPasswordHash = rows[0].password;
        const userEmail = rows[0].email;
        const isPasswordValid = await bcrypt.compare(String(password), userPasswordHash)
        
        return new NextResponse(
            JSON.stringify({ 
                isPasswordValid: isPasswordValid, 
                userEmail: isPasswordValid ? userEmail : null 
            }),
            { 
                status: isPasswordValid ? 200 : 401,
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        )
    } catch (error) {
        return new NextResponse(
            JSON.stringify({ error: 'Authentication failed' }),
            { 
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        )
    }
}

