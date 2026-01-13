// CMS_API_Response: Ce type est une enveloppe de base pour toutes les réponses du CMS.
// Il permet de vérifier si la requête s'est bien passée (code = 200, status = "ok").
// Avant de lire les données, on regarde ces deux champs pour éviter les erreurs.

type CMS_API_Response = {
    code: number,
    status: 'ok' | string,
    message?: string,
}

type CMS_API_Image = {
    extension: string,
    filename: string,
    height: number,
    id: string,
    mime: string,
    niceSize: string,
    template: string | null,
    type: "image",
    url: string,
    width: number
}

type CMS_API_ImageObject = {
    uuid: string,
    alt: string | null,
    url: string,
    tiny: CMS_API_Image,
    small: CMS_API_Image,
    reg: CMS_API_Image,
    large: CMS_API_Image,
    xxl: CMS_API_Image,
    focus?: string,
}

// Types pour les blocs de contenu
type CMS_API_Block = {
    id: string,
    type: string,
    content: any,
    isHidden: boolean
}

// Type pour la page Home
type CMS_API_HomePage = {
    title: string,
    slug: string,
    hero: CMS_API_Block[],
    notreEntreprise_titre: string,
    notreEntreprise_colonne_gauche: CMS_API_Block[],
    notreEntreprise_colonne_droite: CMS_API_Block[],
    nosServices_titre: string,
    nosServices_cartes_taille?: string,
    nosServices_cartes_couleur?: string,
    nosServices_colonne_gauche: CMS_API_Block[],
    nosServices_colonne_droite: CMS_API_Block[],
    image: CMS_API_Block[],
    notreDemarche_titre: string,
    notreDemarche: CMS_API_Block[],
    avis_titre: string,
    avis: CMS_API_Block[],
    images: CMS_API_ImageObject[]
}

// Type pour la page Services
type CMS_API_ServicesPage = {
    title: string,
    slug: string,
    nosServices_titre: string,
    nosServices_colonne_gauche: CMS_API_Block[],
    nosServices_colonne_droite: CMS_API_Block[],
    notreDemarche_titre: string,
    notreDemarche: CMS_API_Block[],
    controleBornes_titre: string,
    controleBornes_colonne_gauche: CMS_API_Block[],
    controleBornes_colonne_droite: CMS_API_Block[],
    controlePhotovoltaique_titre: string,
    controlePhotovoltaique_colonne_gauche: CMS_API_Block[],
    controlePhotovoltaique_colonne_droite: CMS_API_Block[],
    images: CMS_API_ImageObject[]
}

// Type pour la page Contact
type CMS_API_ContactPage = {
    title: string,
    slug: string,
    formulaire_titre: string,
    formulaire_intro?: string,
    formulaire: CMS_API_Block[]
}

// Type pour la page Mentions legales
type CMS_API_MentionsLegalesPage = {
    title: string,
    slug: string,
    texte: string
}
