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
const template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>潦草头像</title>
</head>
<style>
    img {
        width: 100%;
        max-width: 500px;
    }
</style>
<body>
    <img id="avatar" src="/api/avatar" alt="头像">
    <button onclick="switchAvatar()">切换</button>
</body>
<script>
    function switchAvatar() {
        var avatar = document.querySelector("#avatar");
        var url = new URL(avatar.src);
        url.searchParams.set('t', new Date().getTime());
        avatar.src = url.href;
    }
</script>
</html>`;

router.get(
	'/',
	() =>
		new Response(template, {
			headers: {
				'Content-Type': 'text/html',
			},
		})
);

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
