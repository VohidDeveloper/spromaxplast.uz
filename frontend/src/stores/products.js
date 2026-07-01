import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProductsStore = defineStore('products', () => {
  const products = ref([
    {
      id: 1,
      category: 'wall',
      image: '/images/products/wall-panel-1.jpg',
      translations: {
        uz: { name: 'Devoriy PVC panel', description: 'Namiqqa chidamli, oson o\'rnatiladigan devoriy panel' },
        ru: { name: 'Настенная ПВХ панель', description: 'Влагостойкая, легкомонтируемая настенная панель' },
        en: { name: 'Wall PVC Panel', description: 'Moisture-resistant, easy-to-install wall panel' }
      },
      specs: { width: '250mm', thickness: '8mm', length: '3000mm' }
    },
    {
      id: 2,
      category: 'ceiling',
      image: '/images/products/ceiling-panel-1.jpg',
      translations: {
        uz: { name: 'Shiftli PVC panel', description: 'Yengil va chiroyli shift uchun panel' },
        ru: { name: 'Потолочная ПВХ панель', description: 'Лёгкая и красивая потолочная панель' },
        en: { name: 'Ceiling PVC Panel', description: 'Light and elegant ceiling panel' }
      },
      specs: { width: '100mm', thickness: '5mm', length: '3000mm' }
    },
    {
      id: 3,
      category: 'facade',
      image: '/images/products/facade-panel-1.jpg',
      translations: {
        uz: { name: 'Fasad paneli', description: 'Tashqi devor uchun UV bardoshli panel' },
        ru: { name: 'Фасадная панель', description: 'УФ-стойкая панель для внешних стен' },
        en: { name: 'Facade Panel', description: 'UV-resistant panel for exterior walls' }
      },
      specs: { width: '200mm', thickness: '10mm', length: '3000mm' }
    }
  ])

  const categories = [
    { key: 'all', uz: 'Barchasi', ru: 'Все', en: 'All' },
    { key: 'wall', uz: 'Devoriy', ru: 'Настенные', en: 'Wall' },
    { key: 'ceiling', uz: 'Shiftli', ru: 'Потолочные', en: 'Ceiling' },
    { key: 'facade', uz: 'Fasad', ru: 'Фасадные', en: 'Facade' }
  ]

  const activeCategory = ref('all')

  const filtered = computed(() => {
    if (activeCategory.value === 'all') return products.value
    return products.value.filter(p => p.category === activeCategory.value)
  })

  function setCategory(key) {
    activeCategory.value = key
  }

  return { products, categories, activeCategory, filtered, setCategory }
})
