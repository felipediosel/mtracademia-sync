import { query, where, orderBy, getDocs, DocumentData, DocumentReference, QuerySnapshot, deleteDoc, Query } from "firebase/firestore";
import {
    CollectionVersao,
    CollectionPessoa,
    CollectionServico,
    CollectionProduto,
    CollectionContasReceber,
    CollectionContasReceberPagtos,
    CollectionAvaliacao,
    CollectionAvaliacaoQuestao,
    CollectionAvaliacaoResposta,
    CollectionEventoAcesso
} from './collections';

export default class Cleanup {

    /**
     * Keep versions from the last 7 days and exclude others.
     *
     * @return {void} x raised to the n-th power.
     */
    static cleanOldVersions(): void {
        const q = query(CollectionVersao, orderBy("datahora", "desc"));

        getDocs(q)
            .then((Documents: QuerySnapshot<DocumentData>) => {
                if (Documents.size > 0) {
                    let oldVersions: DocumentReference[] = [];

                    let lastDate = Documents.docs[0].data().datahora.toDate();
                    let startDate = new Date();
                    startDate.setDate(lastDate.getDate() - 7);

                    Documents.forEach((Document: DocumentData) => {
                        let documentDate = Document.data().datahora.toDate();

                        if (!(documentDate >= startDate && documentDate <= lastDate)) {
                            oldVersions.push(Document.ref);
                        }
                    });

                    if (oldVersions.length > 0) {
                        Cleanup.deleteOldVersions(oldVersions);
                    }
                }
            });
    }

    private static deleteOldVersions(oldVersions: DocumentReference[]): void {
        oldVersions.forEach((oldVersion: DocumentReference) => {
            deleteDoc(oldVersion);
        });

        Cleanup.deleteFromQuery(query(CollectionPessoa, where('versao', 'in', oldVersions)));
        Cleanup.deleteFromQuery(query(CollectionServico, where('versao', 'in', oldVersions)));
        Cleanup.deleteFromQuery(query(CollectionProduto, where('versao', 'in', oldVersions)));
        Cleanup.deleteFromQuery(query(CollectionContasReceber, where('versao', 'in', oldVersions)));
        Cleanup.deleteFromQuery(query(CollectionContasReceberPagtos, where('versao', 'in', oldVersions)));
        Cleanup.deleteFromQuery(query(CollectionAvaliacao, where('versao', 'in', oldVersions)));
        Cleanup.deleteFromQuery(query(CollectionAvaliacaoQuestao, where('versao', 'in', oldVersions)));
        Cleanup.deleteFromQuery(query(CollectionAvaliacaoResposta, where('versao', 'in', oldVersions)));
        Cleanup.deleteFromQuery(query(CollectionEventoAcesso, where('versao', 'in', oldVersions)));
    }

    private static deleteFromQuery(q: Query) {
        getDocs(q)
            .then((Documents: QuerySnapshot<DocumentData>) => {
                Documents.forEach((Document: DocumentData) => {
                    deleteDoc(Document.ref);
                });
            });
    }
}