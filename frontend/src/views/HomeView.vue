<template>
  <div>
    <section id="hero">
      <HeroSection />
    </section>

    <section id="about">
      <AboutSection />
    </section>

    <section id="products">
      <ProductsSection />
    </section>

    <section id="process">
      <ProcessSection />
    </section>

    <section id="certificates">
      <CertSection />
    </section>

    <section id="partners">
      <PartnersSection />
    </section>

    <section id="contact">
      <ContactSection />
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

import HeroSection     from '@/components/sections/HeroSection.vue'
import AboutSection    from '@/components/sections/AboutSection.vue'
import ProductsSection from '@/components/sections/ProductsSection.vue'
import ProcessSection  from '@/components/sections/ProcessSection.vue'
import CertSection     from '@/components/sections/CertSection.vue'
import PartnersSection from '@/components/sections/PartnersSection.vue'
import ContactSection  from '@/components/sections/ContactSection.vue'

const route = useRoute()

// Sahifa yuklanganda hash bo'lsa smooth scroll
onMounted(() => {
  if (route.hash) {
    const el = document.querySelector(route.hash)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }
})
</script>
