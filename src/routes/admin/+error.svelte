<script lang="ts">
	import { page } from '$app/state';
	import ErrorPanel from '#lib/components/ui/ErrorPanel.svelte';
</script>

<svelte:head>
	<title>Kesalahan {page.status} — Admin Pura Batuan Kaler 360</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<ErrorPanel status={page.status} lang="id" audience="admin" />
