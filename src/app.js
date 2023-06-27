import {
  Observable,
  fromEvent,
  interval,
  switchMap,
  catchError,
  of,
  map,
} from "rxjs";
import { ajax } from "rxjs/ajax";
import moment from "moment/moment";

const CreateMessagesList = (messages) => {
  messages.forEach((message) => {
    const pollingListEl = document.querySelector(".polling-list");

    const pollingListItemEl = document.createElement("li");
    pollingListItemEl.classList.add("polling-list-item");

    const emailEl = document.createElement("div");
    emailEl.classList.add("email");
    emailEl.textContent = message.from;
    pollingListItemEl.append(emailEl);

    const bodyEl = document.createElement("div");
    bodyEl.classList.add("massage-text");
    bodyEl.textContent = message.subject;
    pollingListItemEl.append(bodyEl);

    const timeEl = document.createElement("div");
    timeEl.classList.add("massage-time");
    timeEl.textContent = message.received;
    pollingListItemEl.append(timeEl);

    pollingListEl.prepend(pollingListItemEl);
  });
};

const source = interval(5000).pipe(
  switchMap(() => {
    return ajax.getJSON("http://localhost:7075/messages/unread").pipe(
      catchError((err) => {
        return of({ status: null, timestamp: null, messages: [] });
      })
    );
  }),
  map((value) => {
    value.messages.forEach((message) => {
      message.subject =
        message.subject.length > 15
          ? message.subject.substr(0, 15) + "..."
          : message.subject;
      message.received = moment()
        .millisecond(message.received)
        .format("hh:mm DD.MM.YYYY");
    });
    return value.messages;
  })
);
const subscribe = source.subscribe((val) => CreateMessagesList(val));
