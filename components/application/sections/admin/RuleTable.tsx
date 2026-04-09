'use client';
import { PublicRule } from "@/modules/rule/rule.types";

export type RuleTableProps = {
    rules: PublicRule[];
}

export default function RuleTable(props: RuleTableProps) {
    return (<section>
        <h3>Règlement intérieur</h3>
        <ul>
            {props.rules.length === 0 ? (
                <li>Aucun règlement n'a actuellement été rédigé.</li>
            ) : (
                props.rules.map((rule) => <li key={rule.id}>{rule.content}</li>)
            )}
        </ul>
    </section>)
}