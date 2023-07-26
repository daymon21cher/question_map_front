import { createRouter, createWebHashHistory } from "vue-router";
import RulesList from "@/components/RulesList";
import FieldGame from "@/components/FieldGame";
export default createRouter({
    history: createWebHashHistory(),
    routes:[
        { path: '/game', component: FieldGame, alias: '/' },
        { path: '/rules', component: RulesList }
    ]
})