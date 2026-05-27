<template>
  <div class="wrong">
    <div class="header">
      <span class="back" @click="router.back()">← 返回</span>
      <span class="title">错题本 / 收藏</span>
    </div>

    <div class="tab-row">
      <div class="tab" :class="{ active: tab === 'wrong' }" @click="tab = 'wrong'">错题</div>
      <div class="tab" :class="{ active: tab === 'fav' }" @click="tab = 'fav'">收藏</div>
    </div>

    <div v-if="list.length === 0" class="empty">暂无内容</div>

    <div v-else class="question-list">
      <div v-for="(q, i) in list" :key="q.id" class="item" @click="showDetail(q)">
        <span class="item-id">{{ i + 1 }}</span>
        <span class="item-type">{{ q.type }}</span>
        <span class="item-content">{{ q.content.substring(0, 30) }}...</span>
        <span class="item-ans">答案: {{ q.answer }}</span>
      </div>
    </div>

    <div v-if="detail" class="modal" @click.self="detail = null">
      <div class="modal-content">
        <div class="modal-header">
          <span class="modal-title">{{ detail.type }}题</span>
          <span class="modal-close" @click="detail = null">✕</span>
        </div>
        <div class="modal-body">{{ detail.content }}</div>
        <div class="modal-options">
          <div v-for="(text, key) in detail.options" :key="key" class="modal-opt"
            :class="{ 'is-answer': key === detail.answer }">
            {{ key }}. {{ text }}
          </div>
        </div>
        <div class="modal-answer">正确答案：{{ detail.answer }}</div>
        <button class="remove-btn" @click="remove(detail)">删除本题</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLocalStorage } from '../stores/localStore'

const router = useRouter()
const local = useLocalStorage()
const tab = ref('wrong')
const detail = ref(null)

const list = computed(() => {
  return tab.value === 'wrong'
    ? (local.get('wrongQuestions') || [])
    : (local.get('favorites') || [])
})

function showDetail(q) {
  detail.value = q
}

function remove(q) {
  const key = tab.value === 'wrong' ? 'wrongQuestions' : 'favorites'
  const arr = local.get(key) || []
  local.set(key, arr.filter(i => i.id !== q.id))
  detail.value = null
}
</script>

<style scoped>
.wrong { padding: 16px; max-width: 480px; margin: 0 auto; }
.header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.back { color: #4a90d9; cursor: pointer; }
.title { font-weight: 600; font-size: 15px; }
.tab-row { display: flex; gap: 8px; margin-bottom: 12px; }
.tab { flex: 1; text-align: center; padding: 10px; border-radius: 8px; background: #eee;
  cursor: pointer; font-size: 14px; }
.tab.active { background: #4a90d9; color: #fff; }
.empty { text-align: center; color: #999; padding: 40px; }
.question-list { display: flex; flex-direction: column; gap: 8px; }
.item { display: flex; align-items: center; gap: 8px; background: #fff; border-radius: 8px;
  padding: 12px; box-shadow: 0 1px 4px rgba(0,0,0,.06); cursor: pointer; font-size: 13px; }
.item-id { font-weight: 700; color: #4a90d9; }
.item-type { background: #4a90d9; color: #fff; padding: 1px 6px; border-radius: 4px; font-size: 11px; }
.item-content { flex: 1; color: #333; }
.item-ans { color: #888; font-size: 12px; white-space: nowrap; }
.modal { position: fixed; inset: 0; background: rgba(0,0,0,.5); display: flex;
  align-items: center; justify-content: center; z-index: 100; }
.modal-content { background: #fff; border-radius: 16px; padding: 20px; width: 90%; max-width: 400px; }
.modal-header { display: flex; justify-content: space-between; margin-bottom: 12px; }
.modal-title { font-weight: 700; }
.modal-close { cursor: pointer; font-size: 18px; }
.modal-body { font-size: 14px; line-height: 1.6; margin-bottom: 12px; }
.modal-options { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
.modal-opt { padding: 8px; background: #f5f5f5; border-radius: 6px; font-size: 13px; }
.modal-opt.is-answer { background: #e8f5e9; color: #2e7d32; }
.modal-answer { font-weight: 600; color: #2e7d32; margin-bottom: 12px; }
.remove-btn { width: 100%; background: #f44336; color: #fff; border: none; padding: 10px;
  border-radius: 8px; cursor: pointer; }
</style>