export const queries = [
  {
    id: 1,
    tags: 'ptm,sequence',
    title:
      'Q116 How to build sequences subsets centered around sites of interest for further alignment and context pattern analysis',
    query:
      'SELECT * WHERE {?subject ?predicate ?object . ?object ?k ?o} LIMIT 25',
  },
  {
    id: 2,
    tags: 'selected,existence',
    title: 'Existence level of proteins',
    query:
      'SELECT (count(?pe1)as ?protein_level) \n       (count(?pe2)as ?transcript_level) \n       (count(?pe3)as ?homology) \n       (count(?pe4)as ?predicted)\n       (count(?pe5)as ?uncertain)\nWHERE {\n  {?pe1 :existence :Evidence_at_protein_level}\n  union\n  {?pe2 :existence :Evidence_at_transcript_level}\n  union\n  {?pe3 :existence :Inferred_from_homology}\n  union\n  {?pe4 :existence :Predicted}\n  union\n  {?pe5 :existence :Uncertain}     \n}',
  },
  {
    id: 3,
    title:
      'New proteins without InitiatorMethionine, identified by peptides at position 2',
    tags: 'peptide,processing',
    query:
      'select  distinct ?entry ?pepac where {\n?entry :isoform ?iso .\n?iso :sequence / :chain ?seq;:mapping ?pepmap.\n?pepmap a :PeptideMapping;\n          :position [ :start ?pepstart ; :end ?pepend];\n          :position/:start 1;\n          :withEvidence/:reference/:accession ?pepac \n          . \nFILTER NOT EXISTS{ ?iso :processingProduct/rdf:type :InitiatorMethionine }\n}',
  },
  {
    id: 4,
    tags: 'peptide,splicing,isoforms',
    title: 'potential new isoforms identified by N terminal peptides',
    query:
      "select  distinct ?entry ?pepac ?pepstart ?pepseq where {\n?entry :isoform ?iso .\n  ?iso :sequence / :chain ?seq;:peptideMapping ?pepmap.\n  ?pepmap :position [ :start ?pepstart ; :end ?pepend];\n          :withEvidence/:reference/:accession ?pepac \n          . \nfilter(?pepstart > 5)  \n#amino acid in peptide boundary\nBIND(substr(?seq, ?pepstart+1, 1) as ?firstAA) .\nBIND(substr(?seq, ?pepstart, 1) as ?prevAA) .\nBIND(substr(?seq, ?pepend, 1) as ?lastAA) .\n#sequence context  \nBIND(substr(?seq, ?pepstart-3, $pepend-?pepstart+3) as ?pepseq) .\nfilter(regex (?firstAA,'^M'))\nfilter(!regex (?prevAA,'^[KR]'))   \nfilter(regex (?lastAA,'^[KR]'))   \n}",
  },
  {
    id: 5,
    tags: 'selected,localisation',
    title: 'Q5 located in mitochondrion and that lack a transit peptide',
    query:
      '#title:Q5 located in mitochondrion and that lack a transit peptide\n#ac:A1XBS5,O00159,O00755,O14734,O14972,O15270,A2AJT9,A6NDV4,A6NFY7,A6NK06,B7ZC32\n#tags:selected\nselect distinct ?entry where{\n ?entry :isoform/:localisation/:in/:childOf term:SL-0173\n  FILTER NOT EXISTS{ ?entry :classifiedWith term:KW-0809 }\n}order by ?entry\n',
  },
  {
    id: 6,
    tags: 'selected',
    title: 'Q009 with 3 disulfide bonds and that are not hormones ',
    query:
      '#title:Q009 with 3 disulfide bonds and that are not hormones \n#pending\n#ac:A4D1T9,A6NC86,A6NDD2,A6NDV4,A6NGN9,A8MWS1,A8MWY0,A8MXU0,B1AKI9,D3W0D1\n#tags:selected\nselect distinct ?entry   WHERE {\n ?statement a :DisulfideBond.\n ?entry :isoform ?isoform.\n ?isoform :modifiedResidue ?statement .\n FILTER NOT EXISTS{?entry :classifiedWith term:KW-0372}\n\n# KW-0372 has related cv in go ontolology, the filter bellow will take care of them  \n FILTER NOT EXISTS{?entry :isoform/:function/:in/^:related term:KW-0372}\n}GROUP by ?entry ?isoform HAVING (count(?statement) =3 )\n',
  },
  {
    id: 7,
    tags: 'domain',
    title:
      'Q15, Proteins with a PDZ domain that interact with at least 1 protein which is expressed in brain',
    query:
      '#title:Q15, Proteins with a PDZ domain that interact with at least 1 protein which is expressed in brain\n#ac:O00151,O00233,O00560,O14640,O14641,O14745,O14907,O14908,O14910,O14936\n#tags:selected\nSELECT distinct ?entry WHERE {\n\t?entry :isoform ?iso.\n\t?iso :region/:in term:DO-00477. #PDZ domain\n\t?iso :interaction/:with/:isoform?/:expression/:in/:childOf term:TS-0095 #brain\n}\n',
  },
  {
    id: 8,
    tags: 'selected,domain',
    title:
      'Q19 contains a signal sequence followed by a extracellular domain  containing a "KRKR" motif',
    query:
      '#title:Q19 contains a signal sequence followed by a extracellular domain  containing a "KRKR" motif\n#pending\n#ac:O14672,O71037,P06213,P06756,P08514,P08648,P19438,P21754,P23229,P26006 \n#tags:selected\nSELECT distinct ?entry WHERE {\n#KRKR motif and extracellular domain\n  ?entry :classifiedWith term:KW-0165.\n  ?entry :isoform/:topology ?topo.\n    ?topo :in term:CVTO_0002;:start ?start.\n\n# signal peptide \n  ?entry :isoform/:processing ?signal.\n  ?signal a :SignalPeptide;:end ?end.\n  \n# motif start after signal peptide\n  FILTER(?start = ?end+1)    \n}\n',
  },
  {
    id: 9,
    tags: 'selected,expression,localisation',
    title:
      'Q20, Proteins with >=2 HPA antibodies whose genes are located on chromosome 21 and that are highly expressed at IHC level in heart',
    query:
      '#title:Q20, Proteins with >=2 HPA antibodies whose genes are located on chromosome 21 and that are highly expressed at IHC level in heart\n#pending\n#ac:P56181,P48449,Q8TCY5\n#tags:selected\nselect ?entry  where {\n  select distinct ?entry ?ac where {\n    \n    ?entry :gene / :chromosome "21"^^xsd:string .\n\n    ?entry :isoform / :expression ?s1.\n    ?s1 :in / :childOf  term:TS-0445 .\n    ?s1 :withEvidence ?evi .\n    ?evi :expressionLevel :High .\n    ?evi :experimentalContext / :detectionMethod term:ECO_0000045.\n\n    ?entry :isoform / :mapping ?map .\n    ?map a :AntibodyMapping .\n    ?map :reference / :accession ?ac .\n  }\n} group by ?entry \nhaving (count(?ac)>=2)\n\n',
  },
  {
    id: 10,
    tags: 'gene',
    title: 'Q55 which have genes of length >=2000000 bp',
    query:
      '#title:Q55 which have genes of length >=2000000 bp\n#ac:Q96P27,P23468,Q15700,Q13449,Q9UHC6,P11532,A1Z1Q3\nselect distinct ?entry  where {\n  ?entry :gene / :length ?l .\n  filter (?l >= 2000000)\n}',
  },
  {
    id: 11,
    tags: 'structure,localisation,disease',
    title:
      'Q81 with >=1 3D structure and are located in the mitochondrion and are linked with a disease',
    query:
      '#title:Q81 with >=1 3D structure and are located in the mitochondrion and are linked with a disease\n#ac:Q09013\nSELECT distinct ?entry WHERE {\n  ?entry :classifiedWith term:KW-0002 . # 3D-structure\n  ?entry :classifiedWith term:KW-0496 . # Mitochondrion \n  ?entry :isoform/:medical/rdf:type :Disease.\n}',
  },
  {
    id: 12,
    tags: 'structure,localisation,disease',
    title:
      'Q81 with >=1 3D structure and are located in the mitochondrion and are linked with a disease',
    query:
      '#title:Q81 with >=1 3D structure and are located in the mitochondrion and are linked with a disease\n#ac:Q09013\n',
  },
  {
    id: 13,
    tags: 'structure,localisation',
    title:
      'Q81 with >=1 3D structure and are located in the mitochondrion and are linked with a disease',
    query:
      '#title:Q81 with >=1 3D structure and are located in the mitochondrion and are linked with a disease\n#ac:Q09013\nSELECT distinct ?entry WHERE {\n  ?entry :classifiedWith term:KW-0002 . # 3D-structure\n  ?entry :isoform/:localisation/:in/:childOf term:SL-0173 . #mitochondrion\n  ?entry :isoform/:medical/rdf:type :Disease.\n}',
  },
  {
    id: 14,
    tags: 'selected',
    title:
      'Q87 whose genes are on chromosome X and which do not have a ortholog in mouse',
    query:
      '#title:Q87 whose genes are on chromosome X and which do not have a ortholog in mouse\n#ac:Q71F78\n#tags:selected\nSELECT  ?entry  (count(?tissue)as ?c)  WHERE {\n  ?entry :gene/:chromosome "19"^^xsd:string;:isoform/:expression/:in/rdfs:label  ?tissue.\n}group by ?entry    ORDER BY  ?c limit 5\n\n#select  ?entry ?ac ?tissueCount where { \n#  {SELECT  ?entry  (count(?tissue)as ?tissueCount)  WHERE {\n#    ?entry :gene/:chromosome "19"^^xsd:string;:isoform/:expression/:in  ?tissue.\n#  }group by ?entry    ORDER BY  ?tissueCount limit 5}\n#  \n#?entry :isoform/:expression/:in/rdfs:label ?ac\n#  \n#}group by ?entry ?ac ORDER BY  ?tissueCount \n\n\n',
  },
  {
    id: 15,
    tags: 'localisation',
    title: 'Q1 that are phosphorylated and located in the cytoplasm',
    query:
      '#title:Q1 that are phosphorylated and located in the cytoplasm\n#ac:A1A4S6,A1KZ92,A1L020,A1X283,A2RRP1,A2RU30,A5PLL1,A6NDB9,A6NI72,A6NIZ1,Q8TCT0,Q99828,Q9H6Q3,Q9HBY8,Q9NPB8,Q9NQ66,A0AVT1,A2A288,A2AJT9,A2RTX5,A2RUB6,A3KMH1\nselect distinct ?entry where {\n ?entry :classifiedWith term:KW-0597;:isoform/:localisation/:in/:childOf term:SL-0086\n}order by ?entry\n',
  },
  {
    id: 16,
    tags: 'localisation',
    title: 'Q10 that are glycosylated and not located in the membrane',
    query:
      '#title:Q10 that are glycosylated and not located in the membrane\nselect  distinct  ?entry WHERE  {\n  ?entry :isoform ?iso;:classifiedWith term:KW-0325.\n  FILTER NOT EXISTS {\n    ?iso :topology/:in term:CVTO_0022\n  }\n} \n#ac:A1E959,A1KZ92,A1L453,A1L4H1,A2VEC9,A3KMH1,A4D0S4,A4D0V7,A5D8T8\n',
  },
  {
    id: 17,
    tags: 'selected,existence',
    title:
      'Q107 All proteins with a protein evidence not "At protein level" with a HGNC identifier/xref that includes the regexp "orf"',
    query:
      '#title:Q107 All proteins with a protein evidence not "At protein level" with a HGNC identifier/xref that includes the regexp "orf"\n#ac:A1A4T8\n#tags:selected\nselect  distinct ?entry  where {\n  ?entry :existence/:notIn :Evidence_at_protein_level .\n  ?entry :reference ?r .\n  ?r :provenance db:HGNC ; :accession ?ac .\n  filter (regex(?ac,\'orf\')) .\n}\n',
  },
  {
    id: 18,
    tags: 'selected,structure',
    title:
      'Q108 All proteins that have a 3D structure in PDB that overlap by at least 50 amino acids with a SH3 domain.',
    query:
      '#title:Q108 All proteins that have a 3D structure in PDB that overlap by at least 50 amino acids with a SH3 domain.\n#ac:A1A4S6,O00459,O00499,O15034,O15117,O15259,O43307,O43586,O43639,O60504\n#pending\n#tags:selected\nselect distinct ?entry where {\n  ?entry :isoform ?isoform .\n#get two regions in isoform  \n  ?isoform :region ?reg1,?dom .\n    ?reg1 a :3dStructure ; :start ?s1 ; :end ?s2 .\n    ?dom :in term:DO-00615 ; :start ?d1 ; :end ?d2 .\n  bind ( if(?d2<?s2, ?d2, ?s2) - if(?d1>?s1, ?d1, ?s1) as ?overlap) .\n  filter (?overlap>50)\n}',
  },
  {
    id: 19,
    tags: 'selected',
    title:
      'Q109 All proteins that have a peptide that maps partly or fully into a signal sequence',
    query:
      '#title:Q109 All proteins that have a peptide that maps partly or fully into a signal sequence\n#ac:A6NJS3,O00115,O95445,P00738,P00747,P00751,P01011,P01023,P01024,P01344\n#pending\n#tags:selected\nselect distinct ?entry where {\n?entry :isoform ?isoform .\n#get Signal and Peptide from isoform\n  ?isoform :processing ?signal;:mapping ?pep.\n#signal position\n    ?signal a :SignalPeptide;:start ?s1;:end ?s2 .\n#peptide position\n  ?pep a :PeptideMapping;:position [ :start ?p1 ; :end ?p2] .\n  filter ( ?p1 >= ?s1 && ?p1 < ?s2   )\n}\n',
  },
  {
    id: 20,
    tags: 'expression',
    title:
      'Q11, Proteins that are expressed in liver and involved in transport',
    query:
      '#title:Q11, Proteins that are expressed in liver and involved in transport\n#     (transport,term:GO_0006810, term:KW-0813) \n#ac:A0AV02,A0PJK1,A1A5C7,A4IF30,A5D8V6,A5X5Y0,A6NIM6,A8K7I4,A8MTZ0,A9QM74\nSELECT distinct ?entry WHERE {\n  ?entry :isoform/:expression/:in/:childOf term:TS-0564;\n         :classifiedWith term:KW-0813.\n}\n',
  },
  {
    id: 21,
    tags: 'domain',
    title: 'Q13 with a protein kinase domain but no kinase activity',
    query:
      '#title:Q13 with a protein kinase domain but no kinase activity\n#ac:O15197,O43187,P16066,P20594,P25092,P51841,Q02846,Q05823,Q13308,Q496M5\nSELECT distinct ?entry WHERE {\n  ?entry :isoform/:region/:in term:DO-00529.\n  FILTER NOT EXISTS{\n    ?entry :classifiedWith/:childOf term:2_7_-_-\n  }\n}\n',
  },
  {
    id: 22,
    tags: 'domain',
    title: 'Q14 with 2 SH3 domains and 1 SH2 domain',
    query:
      '#title:Q14 with 2 SH3 domains and 1 SH2 domain\n#ac:O75791,P15498,P16333,P46108,P46109,P52735,P62993,Q13588,Q9UKW4\nselect distinct ?entry  where{\n?entry :isoform ?iso.\n#with 1 SH3\n  {select ?iso where{?iso :region ?stat1. ?stat1 :in term:DO-00614}GROUP BY ?iso  HAVING(count( ?stat1)=1)}\n\n#with 2 SH2\n  {select ?iso where{?iso :region ?stat2. ?stat2 :in term:DO-00615}GROUP BY ?iso HAVING(count( ?stat2)=2)}\n}GROUP BY ?entry\n',
  },
  {
    id: 23,
    tags: 'selected,expression',
    title:
      'Q15, Proteins with a PDZ domain that interact with at least 1 protein which is expressed in brain',
    query:
      '#title:Q15, Proteins with a PDZ domain that interact with at least 1 protein which is expressed in brain\n#ac:O00151,O00233,O00560,O14640,O14641,O14745,O14907,O14908,O14910,O14936\n#tags:selected\nSELECT distinct ?entry WHERE {\n  ?entry :isoform ?iso.\n  ?iso :region/:in term:DO-00477;:interaction/:with/:isoform?/:expression/:in/:childOf term:TS-0095\n}\n',
  },
  {
    id: 24,
    tags: null,
    title:
      'Q16 with a mature chain <= 1000 amino acids which are secreted and do not contain cysteines in the mature chain',
    query:
      '#title:Q16 with a mature chain <= 1000 amino acids which are secreted and do not contain cysteines in the mature chain\n#pending\n#ac:A1E959,A8MXB1,C9JXX5,E0CX11,O43555,O43852,O60259,P01275,P01282,P02647\nSELECT distinct ?entry  WHERE  {\n  ?entry :isoform ?iso.\n  ?iso :localisation/:in term:SL-0243;:sequence / :chain ?chain;:sequence/:length ?len\n  FILTER (?len<1000 && !regex(?chain, "C"))\n}\n\n',
  },
  {
    id: 25,
    tags: null,
    title:
      'Q16 with a mature chain <= 100 amino acids which are secreted and do not contain cysteines in the mature chain',
    query:
      '#title:Q16 with a mature chain <= 100 amino acids which are secreted and do not contain cysteines in the mature chain\n#pending\n#ac:P22352,P49908,P59796\nSELECT distinct ?entry WHERE{\n{SELECT distinct ?entry WHERE  {\n  ?entry :isoform ?iso.\n  ?iso :sequence/:length ?len;:localisation/:in/:related/:childOf term:SL-0243\n  FILTER (?len<1000)\n}}\n{SELECT distinct ?entry WHERE  {\n  ?entry :isoform ?iso.\n  ?iso :modifiedResidue/rdf:type :NonStandardAminoAcid\n}}\n}\n',
  },
  {
    id: 26,
    tags: null,
    title:
      'Q16 with a mature chain <= 100 amino acids which are secreted and do not contain cysteines ',
    query:
      '#title:Q16 with a mature chain <= 100 amino acids which are secreted and do not contain cysteines \n#pending\n#ac:P22352,P49908,P59796\nSELECT distinct ?entry WHERE {\n {SELECT distinct ?entry WHERE  {\n  ?entry :isoform ?iso.\n  ?iso :modifiedResidue/rdf:type :NonStandardAminoAcid\n  }}\n  ?entry :isoform ?iso.\n  ?iso :sequence/:length ?len;\n       :localisation/:in/:related/:childOf term:SL-0243\n  FILTER (?len<1000)\n}\n\n',
  },
  {
    id: 27,
    tags: 'expression,localisation',
    title:
      'Q17, Proteins >=1000 amino acids and located in nucleus and expression in nervous system',
    query:
      '#title:Q17, Proteins >=1000 amino acids and located in nucleus and expression in nervous system\n#pending\n#ac:A3KN83,A4D0V7,A5PL33,A6NHR9,A8MQ14,B1AJZ9,O00159,O00203,O00267,O00268\nSELECT distinct ?entry WHERE  {\n  ?entry :isoform ?iso.\n  ?iso :localisation/:in/:childOf term:SL-0191;:expression/:in/:childOf term:TS-1313;:sequence/:length ?len.\n  FILTER (?len>1000)\n}\n',
  },
  {
    id: 28,
    tags: 'localisation',
    title: 'Q18 that are acetylated and methylated and located in the nucleus',
    query:
      '#title:Q18 that are acetylated and methylated and located in the nucleus\n#pending\n#ac:O00159,O14979,O43524,O60506,O60814,O75530,O75925,P01112,P02545 \nselect distinct ?entry where {\n  ?entry :isoform/:localisation/:in /:childOf term:SL-0191.\n# acetylated and methylated\n  ?entry :classifiedWith term:KW-0007,term:KW-0488.\n}\n',
  },
  {
    id: 29,
    tags: 'selected,domain',
    title:
      'Q19 contains a signal sequence followed by a extracellular domain  containing a "KRKR" motif',
    query:
      '#title:Q19 contains a signal sequence followed by a extracellular domain  containing a "KRKR" motif\n#pending\n#ac:O14672,O71037,P06213,P06756,P08514,P08648,P19438,P21754,P23229,P26006 \n#tags:selected\nSELECT distinct ?entry WHERE {\n#KRKR motif and extracellular domain\n  ?entry :classifiedWith term:KW-0165.\n  ?entry :isoform/:topology ?topo.\n    ?topo :in term:CVTO_0002;:start ?start.\n\n# signal peptide \n  ?entry :isoform/:processing ?signal.\n  ?signal a :SignalPeptide;:end ?end.\n  \n# motif start after signal peptide\n  FILTER(?start = ?end+1)    \n}\n',
  },
  {
    id: 30,
    tags: 'localisation',
    title: 'Q2 that are located both in the cytoplasm and in the nucleus',
    query:
      '#title:Q2 that are located both in the cytoplasm and in the nucleus\nselect distinct ?entry where {\n  ?entry :isoform ?iso.\n    ?iso :localisation/:in/:childOf term:SL-0086,term:SL-0191\n}order by ?entry\n#ac:A0AVF1,A0PK00,A1A4S6,A1A5C7,A1KXE4,A2RRD8,A5A3E0,A5PL33,A6NDU8,A1L020,A2A288,A5LHX3,A5PLL1,A5YKK6',
  },
  {
    id: 31,
    tags: 'selected,localisation',
    title:
      'Q20, Proteins with >=2 HPA antibodies whose genes are located on chromosome 21 and that are highly expressed at IHC level in heart',
    query:
      '#title:Q20, Proteins with >=2 HPA antibodies whose genes are located on chromosome 21 and that are highly expressed at IHC level in heart\n#pending\n#ac:A0A183,A0AUZ9,A0AV02,A0AV96,A0AVI4,A0AVT1,A0FGR8,A0FGR9,A0MZ66,A0PG75\n#tags:selected\nSELECT distinct ?entry WHERE {\n# expressed in brain according to IHC\n  ?entry :isoform/:expression ?s1.\n  ?s1 :in/:childOf  term:TS-0445;:withEvidence/:experimentalContext/:detectionMethod term:ECO_0000045.\n}\n  \n',
  },
  {
    id: 32,
    tags: null,
    title: 'Q22 Proteins with no function annotated ',
    query:
      '#title:Q22 Proteins with no function annotated \n# uniprot search, not possible, with grep (no CC_FUNCTION + no GO...F: + no GO...P:) -> 3109 entries\n# :function is owl:oneOf (:OntologyAnnotation :GoMolecularFunction :GoBiologicalProcess \n#                          :UniprotKeyword :EnzymeClassification :Allergen :CatalyticActivity \n#                          :Caution :Cofactor :EnzymeRegulation :Function :Pathway :ToxicDose \n#                         )\n#pending\n#ac:A0AV96,A0M8Q6,A0PJX0,A0PJZ0,A0ZSE6,A1A5C7,A1A5D9,A1KZ92,A1L0T0,A1L390\nselect distinct ?entry where  {\n  ?entry :isoform/:function ?function.\n  FILTER NOT EXISTS {?entry :isoform/:function/rdf:type  :Function}\n}order by ?entry',
  },
  {
    id: 33,
    tags: null,
    title: 'Q24 with >1 reported gold interaction ',
    query:
      '#title:Q24 with >1 reported gold interaction \n#pending\n#ac:A0AVK6,A0FGR8,A0FGR9,A1A4S6,A5D8V7,A5PKW4,A5YKK6,A7E2Y1,A7KAX9,A7MCY6\nselect distinct ?entry  where {\n  ?entry :isoform/:interaction ?interaction.\n  ?interaction :with ?interactant;:quality :GOLD\n} order by ?entry',
  },
  {
    id: 34,
    tags: 'selected,disease',
    title: 'Q25 with >=50 interactors and not involved in a disease ',
    query:
      '#title:Q25 with >=50 interactors and not involved in a disease \n#pending\n#ac:A0AVK6,A0FGR8,A0FGR9,A1A4S6,A5D8V7,A5PKW4,A5YKK6,A7E2Y1,A7KAX9,A7MCY6\n#tags:selected\nselect distinct ?entry  where {\n  ?entry :isoform ?iso.\n  ?iso :interaction/:with ?interaction .\n  FILTER NOT EXISTS {   ?iso :medical/rdf:type :Disease. }\n  FILTER NOT EXISTS {   ?isoform :variant/:disease ?linkedDisease . }\n}group by ?entry ?iso having (count(?interaction) >= 50) order by ?entry',
  },
  {
    id: 35,
    tags: 'localisation',
    title: 'Q26 interacting with >=1 protein located in the mitochondrion',
    query:
      '#title:Q26 interacting with >=1 protein located in the mitochondrion\n#pending\n#ac:A0JLT2,A0PJW6,A2A2Y4,O00193,O00198,O00217,O00220,O00221,O00231,O00254\nselect distinct ?entry where {\n  ?entry :isoform/:interaction/:with ?interaction.\n   ?interaction  :isoform/:localisation/:in/:childOf term:SL-0173\n}group by ?entry ?interaction',
  },
  {
    id: 36,
    tags: 'evidence',
    title: 'Q27 with >=1 glycosylation sites reported in PubMed:X or PubMed:Y',
    query:
      '#title:Q27 with >=1 glycosylation sites reported in PubMed:X or PubMed:Y\n#pending\n#ac:A2BFH1,A2RU67,A6NI73,A8MVS5,O00206,O00241,O00478,O00481,O14672,O14786\nselect distinct ?entry ?pub where{\n#fix publications\n values ?publications {"PubMed:20570859"^^xsd:string "PubMed:14760718"^^xsd:string}\n# fix the type\n ?statement a :GlycosylationSite.\n# get all assertions from the publications\n ?entry :isoform/:modifiedResidue ?statement.\n ?statement :withEvidence/:publication/:from ?publications\n}',
  },
  {
    id: 37,
    tags: null,
    title: 'Q3 with >=37 transmembrane region',
    query:
      '#title:Q3 with >=37 transmembrane region\nselect distinct ?entry where{\n ?entry :isoform ?iso.\n   ?statement a :TransmembraneRegion.\n   ?iso :topology ?statement\n}GROUP BY ?entry ?iso HAVING(count( ?statement)>=37)\n#ac:Q9H5I5\n\n',
  },
  {
    id: 38,
    tags: 'selected,localisation',
    title:
      'Q30 whose gene is located in chromosome 2 that belongs to families with >=5 members in the human proteome',
    query:
      '#title:Q30 whose gene is located in chromosome 2 that belongs to families with >=5 members in the human proteome\n#ac:A0AVI2,A5A3E0,A6NCK2,A6NFX1,A8MUA0,A8MX76,O00338,O00470,O00506,O14649 ...\n#tags:selected\nselect ?entry  where{\n  ?entry :family/:accession/^:accession/^:family ?member.\n  ?entry :gene / :chromosome "2"^^xsd:string .\n} group by ?entry  having ( count(?member) >= 5 )',
  },
  {
    id: 39,
    tags: 'selected,localisation',
    title:
      'Q30 whose gene is located in chromosome 2 that belongs to families with >=5 members in the human proteome',
    query:
      '#title:Q30 whose gene is located in chromosome 2 that belongs to families with >=5 members in the human proteome\n#ac:A0AVI2,A5A3E0,A6NCK2,A6NFX1,A8MUA0,A8MX76,O00338,O00470,O00506,O14649 ...\n#tags:selected\nselect distinct ?entry  where{\n#select family with >=5 members\n  {select ?family where{?family ^:accession/^:family ?entry}group by ?family  having ( count(?entry) >= 5 )}\n#constraint with chromosome 2  \n  ?entry :gene / :chromosome "2"^^xsd:string;:family/:accession ?family.\n} ',
  },
  {
    id: 40,
    tags: null,
    title: 'Q31 with >=10 "splice" isoforms ',
    query:
      '#title:Q31 with >=10 "splice" isoforms \n#pending\n#ac:O00453,O00499,O15320,O15350,O15519,O43251,O43497,O43521,O43852,O60716\nSELECT  distinct ?entry   WHERE  {\n  ?entry :isoform ?iso.\n} GROUP BY ?entry HAVING(count(?iso)>=10)\n',
  },
  {
    id: 41,
    tags: 'domain',
    title:
      'Q32 with a coiled coil region and involved in transcription but does not contain a bZIP domain',
    query:
      '#title:Q32 with a coiled coil region and involved in transcription but does not contain a bZIP domain\n#pending\n#ac:A6H8Y1,D6RGH6,O00291,O14529,O14686,O14776,O15164,O60281,O60284,O60341\nselect distinct ?entry where {\n ?entry :isoform ?iso;:classifiedWith term:KW-0804.\n ?iso :region/rdf:type :CoiledCoilRegion.\n FILTER NOT EXISTS{\n   ?iso :region term:DO-00078\n }\n}\n',
  },
  {
    id: 42,
    tags: 'domain',
    title:
      'Q34 with >=1 homeobox domain and with >=1 variant in the homeobox domain(s)',
    query:
      '#title:Q34 with >=1 homeobox domain and with >=1 variant in the homeobox domain(s)\n#pending\n#ac:A2RU54,A6NCS4,A6NFQ7,A6NHT5,A6NJ46,A6NJG6,A6NJT0,A6NLW8,A6NMT0,A6NNA5\nSELECT distinct ?entry  WHERE {\n    ?entry :isoform ?iso.\n    \n# with >=1 homeobox domain    \n    ?iso  :region  ?st1.\n    ?st1 :in term:DO-00312;:start ?start;:end ?end.\n\n# with >=1 variant\n    ?iso  :variant  ?st2.\n    ?st2 a :SequenceVariant;:start ?variant.\n\n# one variant in the homeobox domain\n    FILTER (?variant >=?start && ?variant <=?end)\n}\n',
  },
  {
    id: 43,
    tags: 'localisation',
    title: 'Q35 Proteins located in the mitochondrion and which is an enzyme',
    query:
      '#title:Q35 Proteins located in the mitochondrion and which is an enzyme\n#pending\n#ac:A6NK06,A6NK58,A8MUP2,A8MXV4,O00141,O00142,O00154,O00217,O00411,O14734,O15270,O15498,O43462,O43688,O94923,O95302,O95747\nSELECT distinct  ?entry   WHERE  {\n  ?entry :classifiedWith/rdf:type :EnzymeClassificationOntology.\n  ?entry :isoform/:localisation/:in/:childOf term:SL-0173\n}\n',
  },
  {
    id: 44,
    tags: null,
    title: 'Q38 with >=1 selenocysteine in their sequence',
    query:
      '#title:Q38 with >=1 selenocysteine in their sequence\n#ac:O60613,P07203,P18283,P22352,P36969,P49895,P49908,P55073,P59796,P59797\nSELECT distinct ?entry WHERE  {\n  ?entry :isoform/:modifiedResidue/rdf:type :NonStandardAminoAcid\n}\n',
  },
  {
    id: 45,
    tags: null,
    title:
      'Q39 with >=1 mutagenesis in a position that correspond to an annotated active site',
    query:
      '#title:Q39 with >=1 mutagenesis in a position that correspond to an annotated active site\n#pending\n#ac:O00115,O00308,O00391,O00762,O14757,O14773,O15033,O15294,O15393,O15527\nSELECT distinct ?entry WHERE  {\n  ?entry :classifiedWith/rdf:type :EnzymeClassificationOntology;:isoform ?iso.\n  ?iso :mutation ?muta;:site ?site.\n    ?muta rdf:type :MutagenesisSite;:start ?mutaPos.\n    ?site rdf:type :ActiveSite;:start ?sitePos.\n  FILTER(?mutaPos=?sitePos)\n}',
  },
  {
    id: 46,
    tags: 'expression',
    title: 'Q4, Proteins highly expressed in brain but not expressed in testis',
    query:
      '#title:Q4, Proteins highly expressed in brain but not expressed in testis\nSELECT distinct ?entry WHERE {\n# get all expression\n  ?entry :isoform/:expression ?s1,?s2.\n\n# highly expressed in brain\n  ?s1 :in/:childOf  term:TS-0095;:withEvidence/:expressionLevel :High.\n\n# not expressed in testis\n  ?s2 :in/:childOf  term:TS-1030;:withEvidence/:expressionLevel :Negative.\n}\n#ac:A1L3X0,A2RUS2,A5PLN9,A5YM72,A6NFN3,A6NH11,A6NH21,A6NHL2,A6NI56',
  },
  {
    id: 47,
    tags: 'selected',
    title:
      'Q40 that are enzymes and with >=1 mutagenesis that "decrease" or "abolish" activity ',
    query:
      '#title:Q40 that are enzymes and with >=1 mutagenesis that "decrease" or "abolish" activity \n#ac:A1Z1Q3,A2RUC4,O00141,O00329,O00418,O00429,O00443,O00487,O00571,O14744\n#tags:selected\nSELECT distinct ?entry  WHERE  {\n  ?entry :classifiedWith/rdf:type :EnzymeClassificationOntology.\n  ?entry :isoform/:mutation ?statement.\n    ?statement rdf:type :MutagenesisSite;rdfs:comment ?comment\n  FILTER regex(?comment, "(decrease|abolish).*activity","i")\n}',
  },
  {
    id: 48,
    tags: 'evidence',
    title: 'Q41 that are annotated with GO "F" terms prefixed by "Not"',
    query:
      '#title:Q41 that are annotated with GO "F" terms prefixed by "Not"\n#pending\n#ac:A1A5B4,O00712,O15078,O15164,O15247,O15457,O43196,O43435,O43820,O60673\nSELECT distinct ?entry  WHERE  {\n  ?entry :isoform/:function ?statement.\n  ?statement a :GoMolecularFunction;:withEvidence/:negative "true"^^xsd:boolean.\n}',
  },
  {
    id: 49,
    tags: 'disease',
    title: 'Q47 with a gene name CLDN*',
    query:
      "#title:Q47 with a gene name CLDN*\n#ac:A6NM45,C9JDP6,O00501,O14493,O15551,O75508,O95471,O95484,O95500,O95832 \nSELECT distinct ?entry ?v  WHERE  {\n  ?entry :isoform ?iso.\n  ?iso :variant ?statement;:medical/rdf:type :Disease.\n  ?statement :original 'C'^^xsd:string;:variation ?v\n}\n",
  },
  {
    id: 50,
    tags: 'selected,disease',
    title: 'Q48 with >=1 variants of the type "C->" (Cys to anything else) ',
    query:
      '#title:Q48 with >=1 variants of the type "C->" (Cys to anything else) \n#     that are linked to >=1 disease\n# medical, \n#     is oneOf (:Biotechnology :Disease :Pharmaceutical :Polymorphism )\n#pending\n#ac:A6NHR9,O00187,O00255,O00305,O00555,O00584,O00754,O14686,O14773,O14802\n#tags:selected\nSELECT distinct ?entry WHERE  {\n  ?entry :isoform / :variant ?variant .\n  ?variant :original "C"^^xsd:string;:variation ?v.\n  ?variant :disease ?someDisease .\n}',
  },
  {
    id: 51,
    tags: null,
    title: 'Q49 with >=1 variants of the types "A->R" or "R->A"',
    query:
      '#title:Q49 with >=1 variants of the types "A->R" or "R->A"\n#ac:O00222,O00330,O14556,O14639,O14827,O14828,O15061,O15164,O15357,O43822\nSELECT distinct ?entry WHERE  {\n  ?entry :isoform/:variant ?statement.\n  {?statement :original "A"^^xsd:string;:variation "R"^^xsd:string}\n  UNION\n  {?statement :original "R"^^xsd:string;:variation "A"^^xsd:string}\n}',
  },
  {
    id: 52,
    tags: 'selected,localisation',
    title: 'Q5 located in mitochondrion and that lack a transit peptide',
    query:
      "#title:Q5 located in mitochondrion and that lack a transit peptide\n#ac:A1XBS5,O00159,O00755,O14734,O14972,O15270,A2AJT9,A6NDV4,A6NFY7,A6NK06,B7ZC32\n#tags:selected\nselect distinct ?entry where{\n ?entry :isoform/:localisation/:in/:childOf term:SL-0173 .\n filter not exists {\n   ?entry :isoform / :processing ?tp .\n   ?tp a :TransitPeptide .\n   ?tp rdfs:comment ?com.\n   filter (contains (?com,'Mitochondrion'))\n  }\n}\n",
  },
  {
    id: 53,
    tags: 'selected,localisation',
    title: 'Q5 located in mitochondrion and that lack a transit peptide',
    query:
      '#title:Q5 located in mitochondrion and that lack a transit peptide\n#ac:A1XBS5,O00159,O00755,O14734,O14972,O15270,A2AJT9,A6NDV4,A6NFY7,A6NK06,B7ZC32\n#tags:selected\nselect distinct ?entry where{\n ?entry :isoform/:localisation/:in/:childOf term:SL-0173\n  FILTER NOT EXISTS{ ?entry :classifiedWith term:KW-0809 }\n}order by ?entry\n',
  },
  {
    id: 54,
    tags: 'selected,expression',
    title: 'Q50, Proteins which are expressed in brain according to IHC ',
    query:
      '#title:Q50, Proteins which are expressed in brain according to IHC \n#     but not expressed in brain according to microarray\n# ECO_0000045 as IHC, ECO_0000104 as EST and ECO_0000220 as microarray\n#pending\n#ac:\n#tags:selected\nSELECT distinct ?entry WHERE {\n  ?entry :isoform ?iso.\n    ?iso :expression ?s1,?s2.\n# not expressed in brain according to microarray \n  ?s2 :in/:childOf  term:TS-0095;:withEvidence/:expressionLevel :Negative;:withEvidence/:experimentalContext/:detectionMethod term:ECO_0000220.\n# expressed in brain according to IHC\n  ?s1 :in/:childOf  term:TS-0095;:withEvidence/:experimentalContext/:detectionMethod term:ECO_0000045.\n}\n\n\n',
  },
  {
    id: 55,
    tags: 'selected,evidence',
    title: 'Q53  which are involved in cell adhesion according to GO with ',
    query:
      '#title:Q53  which are involved in cell adhesion according to GO with \n#     an evidence not IAE and not ISS\n#using :notIn partition\n#pending \n#ac:Q86UP0,Q86UP6,Q86UX7,Q75N03,Q76LX8,Q7L5Y9\n#tags:selected\nSELECT distinct ?entry WHERE {\n ?entry  :isoform/:function ?statement.\n ?statement :in / :childOf term:GO_0007155;:withEvidence/:code/:notIn :IEA,:ISS\n}\n',
  },
  {
    id: 56,
    tags: 'selected,evidence',
    title: 'Q53  which are involved in cell adhesion according to GO with ',
    query:
      '#title:Q53  which are involved in cell adhesion according to GO with \n#     an evidence not IAE and not ISS\n#ac:O00192,O14498,O14522,O14936,O15357,O43294,O43312,O43529,O60462,O60486\nSELECT distinct ?entry WHERE {\n ?entry  :isoform/:function ?statement.\n ?statement :in term:GO_0007155.\n  FILTER NOT EXISTS {\n    ?statement :withEvidence/:code ?type\n    values ?type {:IEA :ISS}\n  }\n}\n',
  },
  {
    id: 57,
    tags: 'selected,evidence',
    title: 'Q53  which are involved in cell adhesion according to GO with ',
    query:
      '#title:Q53  which are involved in cell adhesion according to GO with \n#     an evidence not IAE and not ISS\n#using owl:differentFrom partition (that should be manually inferred)\n#ac:O00192,O14498,O14522,O14936,O15357,O43294,O43312,O43529,O60462,O60486 \nSELECT distinct ?entry WHERE {\n ?entry  :isoform/:function ?statement.\n ?statement :in term:GO_0007155;:withEvidence/:code/owl:differentFrom :IEA,:ISS\n}\n',
  },
  {
    id: 58,
    tags: 'evidence,localisation',
    title:
      'Q57  which are located in mitochondrion with an evidence other than HPA and DKFZ-GFP',
    query:
      '#title:Q57  which are located in mitochondrion with an evidence other than HPA and DKFZ-GFP\n# WARNING! term:SL-0173 is (this must be inferred) \n#        rdfs:sameAs term:GO:0005739;\n#        rdfs:sameAs term:KW-0496; \n#pending\n#ac:A2AJT9,A6NDV4,A6NFY7,A6NK06,A6NK58,A8K5M9,A8MUP2,A8MXV4,B7ZC32 \nSELECT  ?entry  WHERE {\n  ?entry :isoform/:localisation ?statement.\n    ?statement :in/:childOf term:SL-0173\n    FILTER NOT EXISTS{?statement :withEvidence/:fromXref db:GFP-cDNA}      \n    FILTER NOT EXISTS{?statement :withEvidence/:fromXref db:HPA}      \n}',
  },
  {
    id: 59,
    tags: 'evidence,localisation',
    title: 'Q57  which are located in mitochondrion with an evidence other ',
    query:
      '#title:Q57  which are located in mitochondrion with an evidence other \n#      than HPA and DKFZ-GFP\n# WARNING! term:SL-0173 is (this must be inferred) \n#        rdfs:sameAs term:GO:0005739;\n#        rdfs:sameAs term:KW-0496;\n#pending\n#ac:A1XBS5,O00159,O00755,O14734,O14972,O15270,O15417,O15446,O15498,O43149 \nselect distinct ?entry  where {\n  ?entry :isoform/:localisation ?statement.\n    ?statement :in/:childOf term:SL-0173\n    FILTER NOT EXISTS{\n      ?statement :withEvidence/:fromXref db:HPA,db:GFP-cDNA\n    }      \n}\n',
  },
  {
    id: 60,
    tags: 'disease',
    title: 'Q6 whose genes are on chromosome 2 and linked with a disease',
    query:
      '#title:Q6 whose genes are on chromosome 2 and linked with a disease\n#ac:O00287,O14788,O15198,O75503,O95409,O95452,P00742,P02462,P05165\nselect distinct ?entry where {\n   ?entry :gene/:chromosome  "13"^^xsd:string;\n          :isoform/:medical/rdf:type :Disease.\n}\n',
  },
  {
    id: 61,
    tags: 'domain,evidence',
    title:
      'Q63 which have >=1 RRM RNA-binding domain and either no GO "RNA binding" other a GO "RNA binding" with evidence IEA or ISS',
    query:
      '#title:Q63 which have >=1 RRM RNA-binding domain and either no GO "RNA binding" other a GO "RNA binding" with evidence IEA or ISS\n#pending\n#ac:A0AV96,A6NDY0,A6NEQ0,A6NFN3,A6PVI3,O14979,O15042,O15047,O15056,O43426 \nSELECT distinct ?entry  WHERE {\n ?entry :isoform ?iso\n {\n#>=1 RRM RNA-binding domain \n  ?iso :region/:in term:DO-00581.\n\n#GO "RNA binding" with evidence IEA or ISS \n  FILTER NOT EXISTS {\n   ?iso :function/:in term:GO_0003723\n  }\n }UNION{\n#>=1 RRM RNA-binding domain \n  ?iso :region/:in term:DO-00581.\n\n#GO "RNA binding" with evidence IEA or ISS \n  ?iso :function ?s1.\n  ?s1 :in term:GO_0003723;:withEvidence/:code ?type.\n  values ?type {:IEA :ISS} \n }\n}\n',
  },
  {
    id: 62,
    tags: null,
    title: 'Q64 which are enzymes with an incomplete EC number',
    query:
      '#title:Q64 which are enzymes with an incomplete EC number\n#pending\n#ac:A0PJE2,A0PJZ3,A1A4Y4,A1L0T0,A1L453,A1Z1Q3,A2A288,A2A3K4,A2VDF0,A4D126 \nSELECT  distinct ?entry   WHERE  {\n  ?ec a :EnzymeClassificationOntology.\n  ?entry :classifiedWith ?ec.\n  FILTER regex(?ec, "-"^^xsd:string)\n}\n\n',
  },
  {
    id: 63,
    tags: null,
    title: 'Q65 Proteins with >1 catalytic activity',
    query:
      '#title:Q65 Proteins with >1 catalytic activity\n#pending\n#ac:A1Z1Q3,A4D256,A6NGU5,O00217,O00748,O00763,O14638,O14744,O14756,O14975\nSELECT distinct ?entry    WHERE  {\n  ?ec a :EnzymeClassificationOntology.\n  ?entry :classifiedWith ?ec\n}GROUP BY ?entry HAVING (count(?ec)>1)\n',
  },
  {
    id: 64,
    tags: 'selected',
    title:
      'Q66 that are cytoplasmic with alternate O-glycosylation or phosphorylation at the same positions',
    query:
      '#title:Q66 that are cytoplasmic with alternate O-glycosylation or phosphorylation at the same positions\n#ac:P10636,P31749,P50579,Q02818,Q16566,Q9BRK5,Q9H8J5\n#tags:selected\nSELECT  distinct ?entry ?comment  WHERE  {\n  ?entry :isoform ?iso.\n# get 2 assertion constraints by the cytoplasm localisation   \n    ?iso :modifiedResidue ?s1,?s2;:localisation/:in/:childOf term:SL-0086.\n    ?s1 rdf:type :GlycosylationSite;rdfs:comment ?comment; :start ?gPos.\n    ?s2 rdf:type :AminoAcidModification;:start ?pPos.\n  FILTER(?gPos=?pPos)\n# use this filter to avoid other glyco\n  FILTER regex(?comment, "o-linked","i")\n}',
  },
  {
    id: 65,
    tags: null,
    title:
      'Q67 with alternative acetylation or Ubl conjugation (SUMO or Ubiquitin) at the same positions',
    query:
      '#title:Q67 with alternative acetylation or Ubl conjugation (SUMO or Ubiquitin) at the same positions\n#ac:A0AVT1,A6NNY8,B5ME19,O00116,O00148,O00193,O00231,O00232,O00267,O00299\nSELECT  distinct ?entry ?comment  WHERE  {\n  ?entry :isoform ?iso.\n    ?iso :modifiedResidue ?s1,?s2.\n    ?s1 rdf:type :AminoAcidModification;rdfs:comment ?comment; :start ?gPos.\n    ?s2 rdf:type :CrossLink;:start ?pPos.\n  FILTER(?gPos=?pPos)\n# use this filter to select acetylations\n  FILTER regex(?comment, "acetyl","i")\n}',
  },
  {
    id: 66,
    tags: 'evidence,existence',
    title: 'Q68 with protein existence PE=2 (transcript level)',
    query:
      '#title:Q68 with protein existence PE=2 (transcript level)\n#pending\n#ac:A0A183,A0AVI2,A0PG75,A0PJX2,A0PJY2,A0PK05,A0PK11,A0ZSE6\nSELECT distinct ?entry  WHERE  {\n  ?entry :existence :Evidence_at_transcript_level\n}\n',
  },
  {
    id: 67,
    tags: 'disease',
    title:
      'Q7 linked to diseases that are associated with cardiovascular aspects',
    query:
      '#title:Q7 linked to diseases that are associated with cardiovascular aspects\n#ac:A6NCS4,A6NCS4,O00522,O00522,O00522,O14958,O15273,O15273\nselect distinct ?entry  WHERE {\n# get all entries that are disease and are associated with cardiovascular aspects\n  ?entry :isoform/:medical/:in/:related/:childOf term:D002318.\n}\n',
  },
  {
    id: 68,
    tags: null,
    title: 'Q72 with a cross-reference to CCDS',
    query:
      '#title:Q72 with a cross-reference to CCDS\n#ac:A0A183,A0AUZ9,A0AV02,A0AV96,A0AVF1,A0AVI2,A0AVI4,A0AVK6,A0AVT1,A0FGR8\n#count:16672\nselect distinct ?entry {\n ?entry :reference  / :provenance db:CCDS .\n}\n',
  },
  {
    id: 69,
    tags: 'domain',
    title: 'Q73 Proteins with no domain  ',
    query:
      '#title:Q73 Proteins with no domain  \n#ac:A0A183,A0AUZ9,A0AV02,A0AVF1,A0AVI4,A0AVK6,A0AVT1,A0JLT2,A0JNW5,A0MZ66 \nselect distinct ?entry where{\n  ?entry a :Entry .\n  FILTER NOT EXISTS { ?entry :isoform / :region/rdf:type :Domain}\n}\n',
  },
  {
    id: 70,
    tags: 'evidence',
    title:
      'Q75 which have been detected in the HUPO liver proteome set but not the HUPO plasma proteome set',
    query:
      '#title:Q75 which have been detected in the HUPO liver proteome set but not the HUPO plasma proteome set\n#ac:A0AV96,A0FGR8,A0JNW5,A0MZ66,A0PJX8,A1L0T0,A1L188,A2A3N6,A2RRP1,A2RTX5\n#count:2257\nselect distinct ?entry where {\n  ?entry :isoform / :mapping / :withEvidence / :assignedBy source:PeptideAtlas_human_liver .\n  FILTER NOT EXISTS {\n    ?entry :isoform / :mapping / :withEvidence / :assignedBy source:PeptideAtlas_human_plasma .\n  }\n}',
  },
  {
    id: 71,
    tags: 'selected,expression',
    title:
      'Q77, Proteins which are expressed in liver according to IHC data but not found in HUPO liver proteome set',
    query:
      '#title:Q77, Proteins which are expressed in liver according to IHC data but not found in HUPO liver proteome set\n#ac:A0AUZ9,A0AV02,A0AVI4,A0PG75,A0PJE2,A0PJW6,A0PJW8,A0PJX2,A0PK00,A0PK11\n#tags:selected\nselect distinct ?entry where {\n  ?entry :isoform /:expression ?s1.\n  ?s1 :withEvidence ?evi;:in/:childOf term:TS-0564. #Liver \n  ?evi :experimentalContext / :detectionMethod / rdfs:subClassOf :IHC; :expressionLevel ?level .\n  filter (?level not in (:Negative))\n  FILTER NOT EXISTS {\n    ?entry :isoform / :mapping / :withEvidence / :assignedBy source:PeptideAtlas_human_liver .\n  }\n}',
  },
  {
    id: 72,
    tags: null,
    title:
      'Q8 whose genes are x bp away from the location of the gene of protein Y',
    query:
      '#title:Q8 whose genes are x bp away from the location of the gene of protein Y\nselect distinct ?entry where {\n#example with P53\n   entry:NX_P04637 :gene/:begin ?s;:gene/:chromosome ?chr.\n   ?entry :gene/:begin  ?gs;:gene/:chromosome ?chr.\n   FILTER( ?gs > (?s -50000) && ?gs <= (?s +50000))\n}\n#ac:P04278,P04637,P14415,Q15768,Q96F10,Q9BUR4',
  },
  {
    id: 73,
    tags: 'expression',
    title:
      'Q83, Proteins whose genes are on chromosome N that are expressed only a single tissue/organ',
    query:
      '#title:Q83, Proteins whose genes are on chromosome N that are expressed only a single tissue/organ\n#pending\nSELECT  ?entry  (count(?tissue)as ?c)  WHERE {\n  ?entry :gene/:chromosome "19"^^xsd:string;:isoform/:expression/:in/rdfs:label  ?tissue.\n}group by ?entry    ORDER BY  ?c limit 5\n\n#select  ?entry ?ac ?tissueCount where { \n#  {SELECT  ?entry  (count(?tissue)as ?tissueCount)  WHERE {\n#    ?entry :gene/:chromosome "19"^^xsd:string;:isoform/:expression/:in  ?tissue.\n#  }group by ?entry    ORDER BY  ?tissueCount limit 5}\n#  \n#?entry :isoform/:expression/:in/rdfs:label ?ac\n#  \n#}group by ?entry ?ac ORDER BY  ?tissueCount \n\n\n',
  },
  {
    id: 74,
    tags: 'selected',
    title: 'Q9 with 3 disulfide bonds and that are not hormones ',
    query:
      '#title:Q9 with 3 disulfide bonds and that are not hormones \n#pending\n#ac:A4D1T9,A6NC86,A6NDD2,A6NDV4,A6NGN9,A8MWS1,A8MWY0,A8MXU0,B1AKI9,D3W0D1\n#tags:selected\nselect count distinct ?entry   WHERE {\n?entry :isoform ?isoform.\n?isoform :modifiedResidue ?statement .\n?statement a :DisulfideBond.\nfilter not exists { ?entry :classifiedWith  term:KW-0372 . }\nfilter not exists { ?entry  :isoform / :function  / :in term:GO_0005179  . }\n} GROUP by ?entry ?isoform HAVING (count(?statement) =3 )\n',
  },
  {
    id: 75,
    tags: 'selected',
    title: 'Q9 with 3 disulfide bonds and that are not hormones ',
    query:
      '#title:Q9 with 3 disulfide bonds and that are not hormones \n#pending\n#ac:A4D1T9,A6NC86,A6NDD2,A6NDV4,A6NGN9,A8MWS1,A8MWY0,A8MXU0,B1AKI9,D3W0D1\n#tags:selected\nselect distinct ?entry   WHERE {\n ?statement a :DisulfideBond.\n ?entry :isoform ?isoform.\n ?isoform :modifiedResidue ?statement .\n FILTER NOT EXISTS{?entry :classifiedWith term:KW-0372}\n\n# KW-0372 has related cv in go ontolology, the filter bellow will take care of them  \n FILTER NOT EXISTS{?entry :isoform/:function/:in/^:related term:KW-0372}\n}GROUP by ?entry ?isoform HAVING (count(?statement) =3 )\n',
  },
  {
    id: 76,
    tags: 'selected',
    title:
      'Q95 which are targets of antibiotics - federated query with drugbank -',
    query:
      '#title:Q95 which are targets of antibiotics - federated query with drugbank -\n#ac:O75469,P00374,P00813,P02768,P08183,P11388,P33527,P61073\n#tags:selected\nPREFIX diseasome: <http://wifo5-04.informatik.uni-mannheim.de/diseasome/resource/diseasome/>\nPREFIX drugbank: <http://wifo5-04.informatik.uni-mannheim.de/drugbank/resource/drugbank/>\nPREFIX drug: <http://wifo5-04.informatik.uni-mannheim.de/drugbank/resource/drugcategory/>\nPREFIX server: <http://wifo5-03.informatik.uni-mannheim.de/drugbank/>\nSELECT distinct ?entry \nWHERE {\n  service server:sparql {\n    SELECT distinct ?unipage WHERE {\n    values ?drugs {drug:antibiotics drug:antibioticAgents drug:ophthalmicAntibiotic drug:topicalAntibiotic}\n    ?drug drugbank:drugCategory ?drugs;drugbank:target/drugbank:swissprotPage ?unipage .\n    }\n  }\n ?entry :swissprotPage ?unipage .\n}',
  },
  {
    id: 77,
    tags: 'selected,localisation',
    title:
      'Q97 located on chromosome 2 and having known variants on a phosphotyrosine position',
    query:
      '#title:Q97 located on chromosome 2 and having known variants on a phosphotyrosine position\n#ac:Q9ULH0,Q15303\n#tags:selected\nselect distinct ?entry where {\n  ?entry :isoform ?iso ;\n         :gene / :chromosome "2"^^xsd:string .\n  ?iso :modifiedResidue  ?ptm ;\n       :variant ?var .\n  ?ptm :in term:PTM-0255 ; #phosphotyrosine\n       :in / rdfs:label ?ptmName ;\n       :start ?position .\n  ?var rdf:type :SequenceVariant ;\n       :start ?position .\n}\n',
  },
];
