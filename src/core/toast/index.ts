
interface Notifier {
  error(message: string): void;
}
class ToastNotifier implements Notifier {
  error(message: string) {
    // TODO: 实现 toast业务逻辑
    // toast.error(message)
    console.log("异常弹框：",message)
  }
}
const toast = new ToastNotifier()
export default toast;
