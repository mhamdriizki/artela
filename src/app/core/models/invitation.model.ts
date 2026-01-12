import { MappedInvitationData } from "../utils/response-mapper";

export interface InvitationData extends MappedInvitationData {
  theme: string; // Theme now comes from BE API
}

