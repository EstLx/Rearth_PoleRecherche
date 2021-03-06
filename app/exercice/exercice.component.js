'use strict';

angular.
module('exercice').
component('exercice', {
    templateUrl: 'exercice/exercice.template.html',
    controller: ['$http', '$routeParams', 'ContextFactory', 'UserFactory', '$localStorage', '$location', function exerciceController($http, $routeParams, ContextFactory, UserFactory, $localStorage, $location) {
        /**
            Gère la page exercice, url : /typeExercice/idTechno
        **/

        var self = this;

        // si on accede à l'url d'exercice sans etre connecte
        if(typeof $localStorage.matricule == 'undefined') {
            $location.path('/connect');
        } else {
            if($localStorage.exercice.autorisation !== true || $localStorage.exercice.technoId !== parseInt($routeParams.idExo)) {
            	// Si pas autorisé a passer l'exercice -> retour accueil
            	$location.path('/technologie/panneau-solaire/1');
            }
            else {
                // L'élève est autorisé a passer l'exercice
                this.code = '';

                // Form vars
                this.error = false;
                this.submitted = false;
    	        this.niveau = $localStorage.exercice.niveau;
                this.infrastructure = $localStorage.exercice.infrastructure;
    	        this.nom = $localStorage.exercice.nom;
    	        
    	        // Retrieve data called with component
    	        this.technologie = $routeParams.idExo;
    	        this.type = $routeParams.type;

    	        this.exercice = ContextFactory.getExercice(this.technologie, this.type);

                // modal stuffs
                this.modalRetourShown = false; // hiding modal at first
                this.modalRetour = function() {
                    self.modalRetourShown = !self.modalRetourShown;
                }

                this.modalValidationShown = false; // hiding modal at first
                this.modalValidation = function() {
                    self.modalValidationShown = !self.modalValidationShown;
                }

                // bouton correct
                this.valider = function() {
                    self.submitted = true;
                    // Check code saisi
                    if (self.code !== self.exercice.codeValidation) {
                        self.error = true;
                        return;
                    }

                    // Attribution du badge de réussite a l'exercice
                    if(this.type === DEFI_TECHNOLOGIQUE) {
                        // Découverte
                        ContextFactory.awardDecouverte($localStorage.matricule, this.infrastructure, this.niveau);
                        if(!ContextFactory.getGuildeBrevet(this.infrastructure, this.niveau)) {
                            // si personne n'a le brevet -> calcul si brevet accordé
                            var guilde = $localStorage.guilde;
                            var avancement = ContextFactory.getAvancementDecouverte(this.infrastructure, this.niveau);
                            // on extrait de l'avancement les données qui concerne la guilde de l'élève
                            var elevesDecouvert = avancement[guilde.nom];
                            // Si, avec cette nouvelle découverte, on atteint le quotat pour avoir le brevet, on attribue le badge de découverte
                            if(elevesDecouvert.count === NB_DEC_BREVET) {
                                for(var i=0; i<elevesDecouvert.count; i++) {
                                    ContextFactory.awardBrevet(elevesDecouvert.matricules[i], this.infrastructure, this.niveau);
                                }
                            }
                        }   
                    } else {
                        // Achat de licence
                        ContextFactory.awardLicence($localStorage.matricule, this.infrastructure, this.niveau);   
                    }
                    
                    // Retour accueil
                    $location.path('/technologie/'+self.infrastructure+'/'+self.niveau);

                }

                // bouton incorrect
                this.invalider = function() {
                    self.submitted = true;
                    // check code saisi
                    if (self.code !== self.exercice.codeValidation) {
                        self.error = true;
                        return;
                    }
                    // Retour a l'accueil si l'exercice est faux
                    $location.path('/technologie/'+self.infrastructure+'/'+self.niveau);
                }
            }
        }
    }]
});