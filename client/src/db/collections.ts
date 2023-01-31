import { collection } from "firebase/firestore";
import { firestore } from "./firebase";

export const CollectionVersao = collection(firestore, 'versao');
export const CollectionPessoa = collection(firestore, 'pessoa');
export const CollectionServico = collection(firestore, 'servico');
export const CollectionProduto = collection(firestore, 'produto');
export const CollectionContasReceber = collection(firestore, 'contas-receber');
export const CollectionContasReceberPagtos = collection(firestore, 'contas-receber-pagtos');
export const CollectionAvaliacao = collection(firestore, 'avaliacao');
export const CollectionAvaliacaoQuestao = collection(firestore, 'avaliacao-questao');
export const CollectionAvaliacaoResposta = collection(firestore, 'avaliacao-resposta');
export const CollectionEventoAcesso = collection(firestore, 'evento-acesso');
export const CollectionSincronizacaoAutomatica = collection(firestore, 'sincronizacao-automatica');

export const Collections = [
    CollectionPessoa,
    CollectionServico,
    CollectionProduto,
    CollectionContasReceber,
    CollectionContasReceberPagtos,
    CollectionAvaliacao,
    CollectionAvaliacaoQuestao,
    CollectionAvaliacaoResposta,
    CollectionEventoAcesso
];