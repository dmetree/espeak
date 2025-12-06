import { EReqStatus, TimetableRequests } from "@/components/shared/types/types";

const ReqToCal = {
  [EReqStatus.Open]: TimetableRequests.EStatus.ActionRequired,
  [EReqStatus.Accepted]: TimetableRequests.EStatus.Upcoming,
  [EReqStatus.CallTime]: TimetableRequests.EStatus.Upcoming,
  [EReqStatus.Calling]: TimetableRequests.EStatus.Waiting,
  [EReqStatus.CallInProgress]: TimetableRequests.EStatus.Waiting,
  [EReqStatus.Finished]: TimetableRequests.EStatus.Completed,
  [EReqStatus.Archived]: TimetableRequests.EStatus.Completed,
};

export const convertStatus = (status: EReqStatus) => ReqToCal[status];
