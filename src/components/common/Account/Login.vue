<script lang="ts" setup>
import { computed, ref } from 'vue'
import Vcode from 'slide-verify-code'
import { NButton, NInput, useMessage } from 'naive-ui'
import { v4 as uuidv4 } from 'uuid'
import { isEmail } from '@/utils/is'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { accountLogin, sendEmail } from '@/api'
import { useUserStore } from '@/store'
import { setUserToken } from '@/store/modules/user/helper'

const emit = defineEmits<Emit>()
const userStore = useUserStore()
const { isMobile } = useBasicLayout()
const message = useMessage()

interface Emit {
  (e: 'closeModel'): void
}

const timeCount = ref(0)
const isShowVerify = ref(false)

const loginForm = ref({
  email: '',
  token: '',
  code: '',
})
const disabled = ref({
  token: true,
  code: true,
  submit: true,
})
const placeholder = ref({
  token: '点击完成验证后发送验证码',
})

const emailRef = ref<typeof NInput | null>(null)
const codeRef = ref<typeof NInput | null>(null)

const emailStatus = computed(() => {
  if (loginForm.value.email.length && !isEmail(loginForm.value.email))
    return 'error'

  return undefined
})

const onShow = () => {
  if (disabled.value.token === false) {
    isShowVerify.value = true
  }
  else {
    isShowVerify.value = false
    disabled.value.submit = true
  }
  if (loginForm.value.token.length)
    disabled.value.code = false
}

const onClose = () => {
  isShowVerify.value = false
}

const onSuccess = () => {
  onClose()
  sendMail()
  disabled.value.token = true
  disabled.value.code = false
  countDown()
  loginForm.value.token = ''
  placeholder.value.token = '验证成功，点击重新发送验证码'
}

const onFail = () => {
  onClose()
  disabled.value.token = false
  disabled.value.code = true
  disabled.value.submit = true

  placeholder.value.token = '验证失败，请重新验证'
}

const countDown = () => {
  timeCount.value = 10
  setInterval(() => {
    if (timeCount.value > 0) {
      timeCount.value--
    }
    else
      disabled.value.token = false
  }, 1000)
}

const onKeyUp = () => {
  disabled.value.token = !isEmail(loginForm.value.email)
  disabled.value.submit = !isEmail(loginForm.value.email) || !loginForm.value.code.length
}

const onSubmit = () => {
  if (!isEmail(loginForm.value.email))
    emailRef.value?.focus()

  if (!loginForm.value.code.length)
    codeRef.value?.focus()

  accountLogin(loginForm.value.email.toLowerCase(), loginForm.value.code).then((res) => {
    if (res.status === 'Success') {
      emit('closeModel')
      setUserToken(res.data.token)
      userStore.getUserInfo()
      message.success(res.message as string)
    }
    else {
      codeRef.value?.focus()
      message.error(res.message as string)
    }
  })
}

const setVerifyToken = () => {
  loginForm.value.token = uuidv4().replace(/-/g, '').toString()
}

const sendMail = async () => {
  setVerifyToken()
  await sendEmail(loginForm.value.email, loginForm.value.token).then((res) => {
    if (res.status === 'Success') {
      codeRef.value?.focus()
      message.success(res.message as string)
    }
    else {
      message.error(res.message as string)
    }
  })
}
</script>

<template>
  <div class="p-4 space-y-5 min-h-[200px]">
    <div class="space-y-6">
      <div class="flex items-center space-x-4">
        <div class="flex-1">
          <NInput
            ref="emailRef" v-model:value="loginForm.email" :status="emailStatus" clearable
            placeholder="请输入登录邮箱" @keyup="onKeyUp"
          />
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <div class="flex-1">
          <NInput
            :disabled="disabled.token" :placeholder="placeholder.token" clearable
            readonly
            @click="onShow"
          />
          <Vcode :show="isShowVerify" @close="onClose" @fail="onFail" @success="onSuccess" />
        </div>
        <NButton v-if="timeCount > 0" disabled text>
          {{ timeCount > 0 ? `(${timeCount}s)` : '' }}
        </NButton>
      </div>
      <div class="flex items-center space-x-4">
        <div class="flex-1">
          <NInput
            ref="codeRef" v-model:value="loginForm.code" :disabled="disabled.code"
            :placeholder="isMobile ? '请输入邮箱收到的6位验证码' : '请输入邮箱收到的6位验证码'"
            @keyup="onKeyUp"
          />
        </div>
      </div>

      <div class="flex items-center">
        <NButton :disabled="disabled.submit" block type="success" @click="onSubmit">
          登录/注册
        </NButton>
      </div>
    </div>
  </div>
</template>
