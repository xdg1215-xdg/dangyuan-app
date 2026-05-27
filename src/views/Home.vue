<template>
  <div class="home">
    <div class="hero">
      <h1>📝 党员测试题库</h1>
      <p>共 <strong>{{ total }}</strong> 道题 / 4种题型</p>
    </div>

    <div class="type-grid">
      <div
        v-for="item in typeList"
        :key="item.type"
        class="type-card"
        @click="startPractice(item.type)"
      >
        <div class="type-icon">{{ item.icon }}</div>
        <div class="type-name">{{ item.type }}</div>
        <div class="type-count">{{ item.count }} 题</div>
      </div>
    </div>

    <div class="section-title">🎯 练习模式</div>
    <div class="mode-row">
      <div class="mode-btn" @click="randomPractice">随机练习</div>
      <div class="mode-btn" @click="startWrong">📝 错题本</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import questions from '../question_bank.json'
import { useRouter } from 'vue-router'

const router = useRouter()
const total = ref(0)
const typeList = ref([])

onMounted(() => {
  total.value = questions.length
  const types = [...new Set(questions.map(q => q.type))]
  typeList.value = types.map(t => ({
    type: t,
    icon: t === '单选' ? '☑️' : t === '多选' ? '🔲' : t === '判断' ? '✔️' : '✏️',
    count: questions.filter(q => q.type === t).length,
  }))
})

function startPractice(type) {
  router.push(`/practice/${encodeURIComponent(type)}`)
}

function randomPractice() {
  router.push('/practice/随机练习')
}

function startWrong() {
  router.push('/wrong')
}
</script>

<style scoped>
.home { padding: 20px; max-width: 480px; margin: 0 auto; }
.hero { text-align: center; padding: 20px 0; }
.hero h1 { font-size: 22px; margin-bottom: 8px; }
.hero p { color: #666; }
.type-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 16px 0; }
.type-card { background: #fff; border-radius: 12px; padding: 16px; text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,.08); cursor: pointer; transition: transform .1s; }
.type-card:active { transform: scale(.97); }
.type-icon { font-size: 32px; margin-bottom: 8px; }
.type-name { font-weight: 600; font-size: 16px; margin-bottom: 4px; }
.type-count { font-size: 13px; color: #888; }
.section-title { font-size: 15px; color: #666; margin: 20px 0 10px; padding-left: 4px; }
.mode-row { display: flex; gap: 12px; }
.mode-btn { flex: 1; background: #4a90d9; color: #fff; text-align: center;
  padding: 14px; border-radius: 12px; font-weight: 600; cursor: pointer; }
.mode-btn:last-child { background: #e84040; }
</style>