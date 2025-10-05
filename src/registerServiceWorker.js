import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onRegistered(r) {
    console.log('Service Worker registered:', r);
  },
  onRegisterError(err) {
    console.error('SW registration error:', err);
  },
  onNeedRefresh() {
    console.log('New content available. Refresh to update.');
  },
  onOfflineReady() {
    console.log('App ready to work offline.');
  },
});

export default updateSW;
