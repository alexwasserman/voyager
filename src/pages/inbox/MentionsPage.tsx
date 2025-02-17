import {
  IonBackButton,
  IonButtons,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useAppDispatch, useAppSelector } from "../../store";
import useClient from "../../helpers/useClient";
import { LIMIT } from "../../services/lemmy";
import { FetchFn } from "../../features/feed/Feed";
import { useCallback } from "react";
import { PersonMentionView } from "lemmy-js-client";
import InboxFeed from "../../features/feed/InboxFeed";
import { receivedInboxItems } from "../../features/inbox/inboxSlice";
import MarkAllAsReadButton from "./MarkAllAsReadButton";
import { jwtSelector } from "../../features/auth/authSlice";
import FeedContent from "../shared/FeedContent";

export default function MentionsPage() {
  const dispatch = useAppDispatch();
  const jwt = useAppSelector(jwtSelector);
  const client = useClient();

  const fetchFn: FetchFn<PersonMentionView> = useCallback(
    async (page) => {
      if (!jwt) throw new Error("user must be authed");

      const response = await client.getPersonMentions({
        limit: LIMIT,
        page,
        sort: "New",
        auth: jwt,
        unread_only: false,
      });

      dispatch(receivedInboxItems(response.mentions));

      return response.mentions;
    },
    [client, jwt, dispatch],
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/inbox" text="Boxes" />
          </IonButtons>

          <IonTitle>Mentions</IonTitle>

          <IonButtons slot="end">
            <MarkAllAsReadButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <FeedContent>
        <InboxFeed fetchFn={fetchFn} />
      </FeedContent>
    </IonPage>
  );
}
