import { query, orderBy, getDocs, DocumentData, QuerySnapshot } from "firebase/firestore";
import { CollectionSincronizacaoAutomatica } from '../db/collections';
import { sync } from '../db/sync';
import cron, { ScheduledTask } from 'node-cron';

export function updateCron() {
    const q = query(CollectionSincronizacaoAutomatica, orderBy("hora", "asc"));

    getDocs(q)
        .then((Documents: QuerySnapshot<DocumentData>) => {
            cron.getTasks().forEach((task: ScheduledTask) => {
                task.stop();
            });

            let cronExpressions: string[] = [];

            Documents.forEach((Document: DocumentData) => {
                let Date = Document.data().hora.toDate();
                let cronExpression = `${Date.getSeconds()} ${Date.getMinutes()} ${Date.getHours()} * * *`;

                if (cron.validate(cronExpression)) {
                    cronExpressions.push(cronExpression);
                }
            });

            cronExpressions.filter(distinctCronExpressions).forEach((cronExpression: string) => {
                cron.schedule(cronExpression, () => {
                    console.log(cronExpression);
                    console.log(new Date().toLocaleTimeString());
                    sync();
                });
            });
        });
}

function distinctCronExpressions(value: string, index: number, self: string[]) {
    return self.indexOf(value) === index;
}