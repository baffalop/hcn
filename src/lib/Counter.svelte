<script lang="ts">
import { count } from './stores'

export let id: string
</script>

<button
  {id}
  on:click={() => $count += 1}
  data-testid={id}
  class="rounded-full py-4 px-8 border-2 border-transparent outline-none w-48 tabular-nums focus:border-opacity-100
    bg-svelte/10 active:bg-svelte/20 transition-colors duration-200 ease-in active:transition-none"
>
  Clicks: {$count}
</button>

<style>
</style>
