import { convertStatus } from "@/components/shared/utils/convert-status";
import { EReqStatus } from "@/components/shared/types";
import { TimetableRequests } from "@/components/shared/types";

type TColorScheme = Record<TimetableRequests.EStatus, string>;

const DEFAULT_COLOR_SCHEME = {
  [TimetableRequests.EStatus.ActionRequired]: "#d4a373", //"#7A373A", //"#d67e0a",
  [TimetableRequests.EStatus.Upcoming]: "#d4a373",
  [TimetableRequests.EStatus.Waiting]: "#ffb700",
  [TimetableRequests.EStatus.Completed]: "#1c1c1c",
};

// const REVERCED_COLOR_SCHEME = {
//   [TimetableRequests.EStatus.ActionRequired]: "#d67e0a",
//   [TimetableRequests.EStatus.Upcoming]: "#d67e0a",
//   [TimetableRequests.EStatus.Waiting]: "#ffb700",
//   [TimetableRequests.EStatus.Completed]: "#1c1c1c",
// };

export const getRequestColor = (
  reqStatus?: EReqStatus | TimetableRequests.EStatus,
  colorScheme: TColorScheme = DEFAULT_COLOR_SCHEME
) => {
  return reqStatus || reqStatus === 0
    ? colorScheme[
        typeof reqStatus === "number" ? convertStatus(reqStatus) : reqStatus //@TODO: write more clear solution fot type checking
      ]
    : "";
};
