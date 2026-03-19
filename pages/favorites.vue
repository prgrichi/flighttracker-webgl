<template>
  <main class="flex-1 px-4 py-6 max-w-3xl mx-auto w-full">
    <!-- Title -->
    <header class="mb-6">
      <h1 class="text-xl font-semibold">Favorites</h1>
      <p class="text-sm text-muted-foreground mt-1">Your saved airbases will appear here.</p>
    </header>

    <!-- Empty state -->
    <div
      class="flex flex-col items-center justify-center text-center py-16 border border-dashed border-border rounded-lg"
    >
      <UIcon name="i-lucide-heart" class="w-8 h-8 mb-3 opacity-50" />

      <p class="text-sm text-muted-foreground">No favorites yet.</p>
    </div>
  </main>
</template>

<script setup></script>

<style></style>
