/**
 * Created by Estelle on 31/05/2016.
 * Creates the display for a filter by guild on the filter bar on the left
 */
'use strict';

angular.
module('infoSansBrevet').
component('infoSansBrevet', {
    templateUrl: 'infrastructures/info-technologie/info-sans-brevet/info-sans-brevet.template.html',
    controller: ['$http', '$routeParams', 'ContextFactory', 'UserFactory', '$location', '$localStorage', function infoSansBrevetController($http, $routeParams, ContextFactory, UserFactory, $location, $localStorage) {
        /**
            Gestion de l'affichage des avancement des découvertes si l'élève n'a pas obtenu la technologie et qu'aucun brevet n'a été déposé
        **/

        var self = this;
        
		this.modalShown = false; // hiding modal at first
        this.modalBrevet = function() {
            self.modalShown = !self.modalShown;
        }

        // nb de decouvertes requises pour brevet
        this.decRequired = NB_DEC_BREVET;

        // Retrieve data called with component
        this.nom = $routeParams.nom;
        this.niveau = $routeParams.niveau;

        // faux si le niveau precedent n'a pas ete debloque
        this.debloquable = ContextFactory.unlocked($localStorage.matricule, this.nom, parseInt(this.niveau)-1);
        console.log(this.debloquable);

        this.gains = ContextFactory.getFormattedCouts(this.nom, this.niveau, "gain-tour-guilde");
        this.coutsPose = ContextFactory.getFormattedCouts(this.nom, this.niveau, "pose-guilde");
        this.revenus = ContextFactory.getFormattedCouts(this.nom, this.niveau, "annuite-percue");

        this.avancementsDecouverte = ContextFactory.getAvancementDecouverte(this.nom, this.niveau);

        this.coutsTentativeDecouverte = ContextFactory.getFormattedCouts(this.nom, this.niveau, "decouverte");
        this.solde = UserFactory.getSolde($localStorage.matricule);
            
        this.technologie = ContextFactory.getTechnologie(this.nom, this.niveau).id;
        this.goToExercice = function() {
            // Securite acces exercice
            $localStorage.exercice = {
                "autorisation": true,
                "niveau": this.niveau,
                "infrastructure": this.nom,
                "nom": ContextFactory.getInfrastructure(this.nom).nom,
                "technoId": this.technologie
            }
            // paiement du cout de passage de l'exercice
            UserFactory.pay($localStorage.matricule, this.coutsTentativeDecouverte[0].valeur);
            // redirection
            $location.path('/exercice/'+ DEFI_TECHNOLOGIQUE + '/' + this.technologie);
        }

    }]
});