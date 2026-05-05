<template>
  <footer class="bg-[#2E2E2E] text-[#FCF6F5] py-10">
    <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <div class="mb-4">
          <img
            src="/logo-horizontal-white.svg"
            alt="CVConnect Logo"
            class="h-14"
          />
        </div>
        <p class="text-sm leading-relaxed text-gray-300">
          CVConnect – Nền tảng quản lí ứng viên & tuyển dụng thông minh. Giúp
          doanh nghiệp kết nối nhân tài dễ dàng và hiệu quả.
        </p>
      </div>

      <div>
        <h4 class="font-semibold text-[#f9e6e8] mb-4">Liên kết</h4>
        <ul class="space-y-2 text-sm">
          <li>
            <NuxtLink to="/" class="">Trang chủ</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/jobs" class="">Tin tuyển dụng</NuxtLink>
          </li>
        </ul>
      </div>
      <div>
        <h4 class="font-semibold text-[#f9e6e8] mb-4">Liên hệ</h4>
        <a
          href="https://www.google.com/maps/place/Km10+%C4%90.+Nguy%E1%BB%85n+Tr%C3%A3i,+P.+M%E1%BB%99+Lao,+H%C3%A0+%C4%90%C3%B4ng,+H%C3%A0+N%E1%BB%99i,+Vietnam/@20.9808814,105.787212,813m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3135accdd002377f:0x4e0ed79252574eee!8m2!3d20.9808814!4d105.787212!16s%2Fg%2F11y9qshxg0!5m1!1e1?entry=ttu&g_ep=EgoyMDI1MTIwMi4wIKXMDSoASAFQAw%3D%3D"
          class="text-sm cursor-pointer mb-2 block"
          target="_blank"
        >
          Km10 Đ. Nguyễn Trãi, P. Mộ Lao, Hà Đông, Hà Nội
        </a>
        <a class="text-sm cursor-pointer block" href="mailto:support@cvconnect.com">
          support@cvconnect.com
        </a>
      </div>
    </div>

    <div
      class="mt-10 border-t border-gray-700 pt-4 text-center text-sm text-gray-400"
    >
      © {{ new Date().getFullYear() }} CVConnect. All rights reserved.
    </div>
  </footer>
</template>

<script setup lang="ts"></script>
