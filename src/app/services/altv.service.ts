import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ALTVService {

  constructor() {}

  /**
   * Sends an event to server-side.
   * @param event_name event name to be called
   * @param args arguments
   */
  sendServer(event_name: string, ...args: any) {
    if ((window as any).isAlt) {
      (window as any).alt.emitServer(event_name, ...args);
    } else {
      if (args.length == 0) console.log(`[mockALT] Event ${event_name} (server) has been sent.`)
      else console.log(`[mockALT] Event ${event_name} (server) has been sent. Arguments: [${args}].`)
    }
  }

  /**
   * Sends an event to client-side.
   * @param event_name event name to be called
   * @param args arguments
   */
  sendClient(event_name: string, ...args: Array<any>) {
    if ((window as any).isAlt) {
      (window as any).alt.emit(event_name, ...args);
    } else {
      if (args.length == 0) console.log(`[mockALT] Event ${event_name} (client) has been sent.`)
      else console.log(`[mockALT] Event ${event_name} (client) has been sent. Arguments: [${args}].`)
    }
  }

  /**
   * Adds an callable event from alt:V.
   * @param eventName event name
   * @param callback callback
   */
  addEvent(eventName: string, callback: (...args: any[]) => void) {
    if ((window as any).isAlt) {
      (window as any).alt.on(eventName, callback);
    }
  }

  /**
   * Removes a registered event in browser.
   * @param eventName event name
   * @param args args
   */
  removeEvent(eventName: string, ...args: any) {
    if ((window as any).isAlt) {
      (window as any).alt.off(eventName, args)
    }
  }

  /**
   * Toggles the in-game cursor.
   * @param visibility boolean
   */
  toggleCursor(visibility: boolean) {
    this.sendClient('change_cursor_visibility', visibility);
  }
}
