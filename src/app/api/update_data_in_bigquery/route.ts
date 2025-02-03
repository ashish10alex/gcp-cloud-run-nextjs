import { BigQuery } from '@google-cloud/bigquery';
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: NextRequest) {
    try {
        const data = await request.json()
        
        // Validate input
        if (typeof data.new !== 'number') {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        const bigquery = new BigQuery({});
        const query = `UPDATE drawingfire-b72a8.electrics_cars.custom SET QTY = @newQty WHERE 1=1`;
        const options = {
            query: query,
            params: {newQty: data.new}
        };

        const [job] = await bigquery.createQueryJob(options);
        const [rows] = await job.getQueryResults();
        
        return NextResponse.json(rows, {
            headers: {
                'Cache-Control': 'no-store, max-age=0',
            },
        });

    } catch (error) {
        console.error('Failed to update data:', error);
        return NextResponse.json({ error: 'Failed to update data' }, { status: 500 })
    }
}