import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {
    await client.hSet('car', {
        colore: 'red',
        year: 2020,
        engine: { cylinders: 8 },
        owner: null || '',
        servuce: undefined || ''
    })

    const car = await client.hGetAll('car');
    if (Object.keys(car).length === 0) {
        console.log('Car not found');
        return;
    }
    console.log(car);
};
run();
