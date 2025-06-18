import { createClient, defineScript } from 'redis';
import { itemByViewsKeys, itemsKeys, itemsViewKey } from "$services/keys";
const client = createClient({
	socket: {
		host: process.env.REDIS_HOST,
		port: parseInt(process.env.REDIS_PORT)
	},
	password: process.env.REDIS_PW,
	scripts: {
		//DEEFINIMOS EL NOMBRE DEL SCRIPT
		addOneAndStore: defineScript({
			//numer de claves que queremos pasar al script
			NUMBER_OF_KEYS: 1,
			//ARGV es la matriz de todos los diferentes argumentos que se proporcionan
			SCRIPT: `
			 return redis.call('SET',KEYS[1],1 + tonumber(ARGV[1])) 
			`,
			transformArguments(key: string, value: number) {
				//apartir de este retorno se retornan los dos argumentos que procesara nuestro script
				return [key, value.toString()]
				//['books:count','5']
				//EVALSHA<ID> 1
			},
			// NO TENEMOS UN FORMA DE TRANFORMAR NI SERIALIZAR LOS DATOS
			transformReply(reply: any) {
				return reply
			}

		}),
		incrementView: defineScript({
			NUMBER_OF_KEYS: 3,
			SCRIPT: `
			  local itemsviewsKey=KEYS[1]
			  local itemsKey=KEYS[2]
			  local itemsByViewsKey=KEYS[3]	
			  local itemId = ARGV[1]
			  local userId =ARGV[2]		

			  loca inserted = redis.call('PFADD',itemsviewsKey,userId)
			  
			  if inserted == 1 then 
				redis.call('HINCRBY',itemsKey,'views',1)
				redis.call('ZINCRBY',itemsviewsKey,1,itemId)
			  end
			`,
			transformArguments(itemsId: string, userId: string) {
				return [
					itemsViewKey(itemsId),
					itemsKeys(itemsId),
					itemByViewsKeys(),
					itemsId,
					userId
				]
				//EVALSHA id 3
			}
			,
			transformReply() { },
		})
	}
});

client.on('error', (err) => console.error(err));
client.connect();

export { client };
