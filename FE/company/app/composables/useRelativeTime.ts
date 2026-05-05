import { ref, onMounted, onBeforeUnmount } from "vue";
import moment from "moment-timezone";
import "moment/locale/vi";

export function useMomentRelativeTime(
  timestamp: number | string,
  timezone?: string,
) {
  const relative = ref("");

  // Default timezone = Ho Chi Minh (GMT+7)
  const effectiveTimezone = timezone || "Asia/Ho_Chi_Minh";

  function updateTime() {
    if (!timestamp) {
      relative.value = "";
      return;
    }

    const time =
      typeof timestamp === "number" && timestamp < 1e12
        ? moment.unix(timestamp)
        : moment(timestamp);

    const localizedTime = time.tz(effectiveTimezone);

    moment.updateLocale("vi", {
      relativeTime: {
        future: "Trong %s",
        past: "%s trước",
        s: "vài giây",
        ss: "%d giây",
        m: "1 phút",
        mm: "%d phút",
        h: "1 giờ",
        hh: "%d giờ",
        d: "1 ngày",
        dd: "%d days",
        w: "a week",
        ww: "%d weeks",
        M: "a month",
        MM: "%d months",
        y: "a year",
        yy: "%d years",
      },
    });

    const diffDays = moment().tz(effectiveTimezone).diff(localizedTime, "days");

    if (diffDays >= 1) {
      relative.value = localizedTime.format("DD/MM/YYYY - HH:mm");
    } else {
      relative.value = localizedTime.locale("vi").fromNow();
    }
  }

  onMounted(() => {
    updateTime();
    const interval = setInterval(updateTime, 60 * 1000);
    onBeforeUnmount(() => clearInterval(interval));
  });

  return relative;
}
