import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { District } from "./District";

@Entity({name: "vendedor"})
export class Seller {
    @PrimaryGeneratedColumn("identity", {name: "ven_id", type:"bigint"})
    id!: number;

    @Column("varchar", {length: 30, unique: true, name: "nom_sl", nullable: false})
    names!: string;

    @Column("varchar", {length: 30, unique: true, name: "ape_sl", nullable: false})
    surnames!: string;

    @Column("char", {length: 9, name: "cel_sl"})
    celPhone: string | undefined;


    @ManyToOne(() => District, (district) => district.sellers)
    @JoinColumn({name: "dis_id", referencedColumnName: "dis_id"})
    district!: Relation<District>
}