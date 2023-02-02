import AutoSync from "./autosync";
import Cleanup from "../db/cleanup";
import cron, { ScheduledTask } from 'node-cron';

export default class Manager {

    static schedule(): void {
        cron.getTasks().forEach((task: ScheduledTask) => {
            task.stop();
        });

        Manager.scheduleSync();
        Manager.scheduleCleaning();
    };

    private static scheduleSync(): void {
        AutoSync.scheduleAutoSync();
    };

    private static scheduleCleaning(): void {
        cron.schedule('00 00 00 * * *', () => {
            Cleanup.cleanOldVersions();
        });
    };
}