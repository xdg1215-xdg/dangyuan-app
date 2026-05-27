<template>
  <div class="practice">
    <div class="header">
      <span class="back" @click="router.back()">← 返回</span>
      <span class="title">{{ typeLabel }}</span>
      <span class="counter">{{ current + 1 }}/{{ qList.length }}</span>
    </div>

    <div class="progress-bar">
      <div class="bar" :style="{ width: ((current + 1) / qList.length * 100) + '%' }"></div>
    </div>

    <div class="question-card">
      <div class="type-tag">{{ qList[current].type }}</div>
      <div class="content">{{ qList[current].content }}</div>
    </div>

    <div class="options">
      <div
        v-for="(text, key) in qList[current].options"
        :key="key"
        class="option"
        :class="{
          'selected': selected === key,
          'correct': revealed && key === qList[current].answer,
          'wrong': revealed && selected === key && key !== qList[current].answer
        }"
        @click="selectOption(key)"
      >
        <span class="opt-key">{{ key }}</span>
        <span class="opt-text">{{ text }}</span>
      </div>
    </div>

    <div v-if="revealed" class="result">
      <div class="result-icon">{{ selected === qList[current].answer ? '✅' : '❌' }}</div>
      <div class="result-text">{{ selected === qList[current].answer ? '回答正确' : '回答错误' }}</div>
      <button class="next-btn" @click="nextQuestion">{{ current < qList.length - 1 ? '下一题' : '完成' }}</button>
      <button class="review-btn" @click="addToFav">收藏本题</button>
    </div>

    <div v-if="!revealed && selected" class="submit-row">
      <button class="submit-btn" @click="checkAnswer">确认答案</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import allQuestions from '../question_bank.json'
import { useLocalStorage } from '../stores/localStore'

const route = useRoute()
const router = useRouter()
const local = useLocalStorage()

const typeLabel = decodeURIComponent(route.params.type)
const qList = typeLabel === '随机练习'
  ? [...allQuestions].sort(() => Math.random() - 0.5)
  : allQuestions.filter(q => q.type === typeLabel)

const current = ref(0)
const selected = ref(null)
const revealed = ref(false)

function selectOption(key) {
  if (revealed.value) return
  selected.value = key
}

function checkAnswer() {
  revealed.value = true
  if (selected.value !== qList[current.value].answer) {
    const q = qList[current.value]
    const wrong = local.get('wrongQuestions') || []
    if (!wrong.find(w => w.id === q.id)) {
      wrong.push(q)
      local.set('wrongQuestions', wrong)
    }
  }
}

function nextQuestion() {
  if (current.value < qList.length - 1) {
    current.value++
    selected.value = null
    revealed.value = false
  } else {
    router.push('/')
  }
}

function addToFav() {
  const q = qList[current.value]
  const favs = local.get('favorites') || []
  if (!favs.find(f => f.id === q.id)) {
    favs.push(q)
    local.set('favorites', favs)
  }
  alert('已收藏！')
}

onMounted(() => {
  if (qList.length === 0) router.push('/')
})
</script>

<style scoped>
.practice { padding: 16px; max-width: 480px; margin: 0 auto; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.back { color: #4a90d9; cursor: pointer; font-size: 15px; }
.title { font-weight: 600; font-size: 15px; }
.counter { color: #888; font-size: 14px; }
.progress-bar { height: 4px; background: #eee; border-radius: 2px; margin-bottom: 16px; }
.bar { height: 100%; background: #4a90d9; border-radius: 2px; transition: width .3s; }
.question-card { background: #fff; border-radius: 12px; padding: 16px; margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,.08); }
.type-tag { display: inline-block; background: #4a90d9; color: #fff; font-size: 12px;
  padding: 2px 8px; border-radius: 4px; margin-bottom: 8px; }
.content { font-size: 15px; line-height: 1.6; }
.options { display: flex; flex-direction: column; gap: 10px; }
.option { display: flex; align-items: center; gap: 12px; background: #fff; border-radius: 10px;
  padding: 12px 14px; box-shadow: 0 1px 4px rgba(0,0,0,.06); cursor: pointer;
  border: 2px solid transparent; transition: all .2s; }
.option:active { transform: scale(.98); }
.option.selected { border-color: #4a90d9; background: #f0f7ff; }
.option.correct { border-color: #4caf50; background: #f0fff0; }
.option.wrong { border-color: #f44336; background: #fff0f0; }
.opt-key { font-weight: 700; font-size: 14px; width: 24px; height: 24px; border-radius: 50%;
  background: #eee; display: flex; align-items: center; justify-content: center; }
.opt-text { font-size: 14px; flex: 1; }
.result { text-align: center; margin-top: 16px; }
.result-icon { font-size: 48px; margin-bottom: 8px; }
.result-text { font-size: 16px; font-weight: 600; margin-bottom: 12px; }
.next-btn, .submit-btn { background: #4a90d9; color: #fff; border: none; padding: 12px 32px;
  border-radius: 8px; font-size: 15px; cursor: pointer; margin: 4px; }
.submit-row { margin-top: 16px; text-align: center; }
.submit-btn { width: 100%; }
.review-btn { background: #ff9800; color: #fff; border: none; padding: 10px 24px;
  border-radius: 8px; font-size: 14px; cursor: pointer; margin: 4px; }
</style>