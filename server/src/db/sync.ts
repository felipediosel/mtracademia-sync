import { Collections, CollectionVersao } from './collections'
import { addDoc, CollectionReference, DocumentReference, Timestamp } from "firebase/firestore";

export function sync() {
    addDoc(CollectionVersao, {
        datahora: Timestamp.now()
    })
        .then((DocumentVersao: DocumentReference) => {
            let collectionsPromise: Promise<any>[] = [];

            Collections.forEach((Collection: CollectionReference) => {
                const promiseFetch = fetch(process.env.API_URL + Collection.id, {
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

                                json.forEach((data: any, indexDocument: number) => {
                                    data.versao = DocumentVersao;

                                    addDoc(Collection, data);
                                });
                            });
                        });
                });
        });
}