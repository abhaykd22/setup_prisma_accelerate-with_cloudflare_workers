import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

interface Env {
	DATABASE_URL: string;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const prisma = new PrismaClient({
			datasourceUrl: env.DATABASE_URL,
		}).$extends(withAccelerate());
		console.log(env);
		const user = await prisma.user.findMany({
			where: {
				email: {
					contains: 'alice@prisma.io',
				},
			},
			cacheStrategy: { swr: 60, ttl: 60 },
		});
		console.log(user);
		return new Response(JSON.stringify(user));
	},
} satisfies ExportedHandler<Env>;
