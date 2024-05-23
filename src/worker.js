/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { Router } from 'itty-router';
import { Render } from './face/api';

const router = Router();

router.get('/', () => new Response('访问 /api/avatar 获取头像'));

router.get(
	'/api/avatar',
	() =>
		new Response(Render(), {
			headers: {
				'Content-Type': 'image/svg+xml',
			},
		})
);

export default {
	fetch: router.handle,
};
