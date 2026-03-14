<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4 py-16" style="background:var(--paper)">
    <div class="w-full max-w-md">
      <div class="text-center mb-10">
        <NuxtLink to="/" class="font-display text-2xl font-bold tracking-tight hover:opacity-70 transition-opacity">
          AI<span class="text-red">H</span>M
        </NuxtLink>
        <p class="font-mono-ink text-[10px] tracking-[0.2em] uppercase mt-2" style="color:var(--muted)">
          AI Humanist Manifesto
        </p>
      </div>
      <div style="background:#fefdf9; border: 1px solid var(--paper-border)">
        <slot />
      </div>
    </div>
  </div>
</template>