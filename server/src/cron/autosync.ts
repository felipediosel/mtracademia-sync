import { query, orderBy, getDocs, DocumentData, QuerySnapshot } from "firebase/firestore";
import { CollectionSincronizacaoAutomatica } from '../db/collections';
import { sync } from '../db/sync';
import cron from 'node-cron';

export default class AutoSync {

    static scheduleAutoSync(): void {
        const q = query(CollectionSincronizacaoAutomatica, orderBy("hora", "asc"));

        getDocs(q)
            .then((Documents: QuerySnapshot<DocumentData>) => {
                let cronExpressions: string[] = [];

                Documents.forEach((Document: DocumentData) => {
                    let Date = Document.data().hora.toDate();
                    let cronExpression = `${Date.getSeconds()} ${Date.getMinutes()} ${Date.getHours()} * * *`;

                    if (cron.validate(cronExpression)) {
                        cronExpressions.push(cronExpression);
                    }
                });

                cronExpressions.filter(AutoSync.distinctCronExpressions).forEach((cronExpression: string) => {
                    cron.schedule(cronExpression, () => {
                        console.log(cronExpression);
                        console.log(new Date().toLocaleTimeString());
                        sync();
                    });
                });
            });
    }

    private static distinctCronExpressions(value: string, index: number, self: string[]): boolean {
        return self.indexOf(value) === index;
    }
}