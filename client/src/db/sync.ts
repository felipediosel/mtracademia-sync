import { Collections, CollectionVersao } from './collections'
import { addDoc, CollectionReference, DocumentReference, Timestamp } from "firebase/firestore";

export function sync(handleThen: (
    collectionPercent: number,
    documentPercent: number,
    collectionId: string
) => void) {
    /*@todo Excluir versões antigas, deixar apenas as 10 últimas sincronizações.*/

    addDoc(CollectionVersao, {
        datahora: Timestamp.now()
    })
        .then((DocumentVersao: DocumentReference) => {
            let collectionsPromise: Promise<any>[] = [];

            Collections.forEach((Collection: CollectionReference) => {
                const promiseFetch = fetch(process.env.REACT_APP_API_URL + Collection.id, {
                    headers: {
                        'ngrok-skip-browser-warning': 'true'
                    }
                });

                collectionsPromise.push(promiseFetch);
            });

            Promise.all(collectionsPromise)
                .then((Responses: Response[]) => {
                    let responsesJson: object[] = [];

                    Responses.forEach((Response: Response) => {
                        responsesJson.push(Response.json());
                    });

                    Promise.all(responsesJson)
                        .then((jsons: object[]) => {
                            jsons.forEach((json: any, indexCollection: number) => {
                                let Collection = Collections[indexCollection];

                                let collectionPercent = Math.round(((indexCollection + 1) / Responses.length) * 100);

                                json.forEach((data: any, indexDocument: number) => {
                                    data.versao = DocumentVersao;

                                    let documentPercent = Math.round(((indexDocument + 1) / json.length) * 100);

                                    addDoc(Collection, data)
                                        .then(() => {
                                            handleThen(
                                                collectionPercent,
                                                documentPercent,
                                                Collection.id
                                            );
                                        });
                                });
                            });
                        });
                });
        });
}