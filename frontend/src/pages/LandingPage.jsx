import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Pill as Pills,
  MenuIcon,
  X,
  ArrowRight,
  ClipboardList,
  BarChart,
  UserCheck,
  History,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Clock,
  Zap,
  DollarSign,
  CheckCircle,
  Headphones,
  MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import VideoModel from "./VideoModel";

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const features = [
    {
      icon: <ClipboardList className="h-8 w-8 text-primary-600" />,
      title: "Suivi de Stock Intelligent",
      description:
        "Suivi en temps réel de tous les médicaments avec surveillance des dates d'expiration et alertes de stock bas.",
    },
    {
      icon: <BarChart className="h-8 w-8 text-primary-600" />,
      title: "Analytique d'Utilisation",
      description:
        "Rapports complets et analyses pour optimiser votre inventaire et réduire le gaspillage.",
    },
    {
      icon: <UserCheck className="h-8 w-8 text-primary-600" />,
      title: "Gestion des Utilisateurs",
      description:
        "Contrôle d'accès basé sur les rôles pour le personnel avec des permissions personnalisables et des journaux d'audit.",
    },
    {
      icon: <History className="h-8 w-8 text-primary-600" />,
      title: "Historique Complet",
      description:
        "Suivez chaque mouvement avec des enregistrements d'historique détaillés pour la conformité réglementaire.",
    },
    {
      icon: <RefreshCw className="h-8 w-8 text-primary-600" />,
      title: "Réapprovisionnement Automatique",
      description:
        "Définissez des points de réapprovisionnement et laissez le système générer automatiquement des bons de commande.",
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary-600" />,
      title: "Sécurité & Conformité",
      description:
        "Plateforme conforme aux normes de santé avec des fonctionnalités de sécurité avancées pour protéger les données sensibles.",
    },
  ];

  const benefits = [
    {
      icon: <TrendingUp className="h-12 w-12 text-white" />,
      title: "Augmentation de l'Efficacité",
      description:
        "Réduisez le temps consacré à la gestion des stocks jusqu'à 70% grâce au suivi automatisé et aux alertes intelligentes.",
    },
    {
      icon: <Clock className="h-12 w-12 text-white" />,
      title: "Prévention des Expirations",
      description:
        "Notifications proactives pour les dates d'expiration approchantes, réduisant le gaspillage et économisant des coûts.",
    },
    {
      icon: <Zap className="h-12 w-12 text-white" />,
      title: "Aperçus Instantanés",
      description:
        "Les tableaux de bord en temps réel offrent une visibilité immédiate sur les niveaux de stock et les modèles de consommation.",
    },
    {
      icon: <DollarSign className="h-12 w-12 text-white" />,
      title: "Réduction des Coûts",
      description:
        "Optimisez les quantités et le moment des commandes, conduisant à une réduction moyenne de 23% des coûts d'inventaire.",
    },
  ];
  const navigate = useNavigate();

  const testimonials = [
    {
      name: "Dr. Salma El Idrissi",
      role: "Pharmacienne à Casablanca",
      text: "PharmaStock a transformé notre gestion de stock. Moins d'erreurs, plus d'efficacité. C’est devenu un outil clé dans notre quotidien.",
      image:
        "https://images.pexels.com/photos/6749777/pexels-photo-6749777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      name: "Youssef Benali",
      role: "Responsable Logistique à Rabat",
      text: "Grâce à PharmaStock, nous avons toujours les bons médicaments au bon moment. Le système est fiable et facile à utiliser.",
      image:
        "https://najda.ma/wp-content/uploads/elementor/thumbs/img-medecin-homme-qvugx9dkqig93rsqf14oqnhllpcxzf3zbjtvkuykxc.png",
    },
    {
      name: "Khadija Amrani",
      role: "Directrice de Pharmacie à Marrakech",
      text: "L’automatisation des alertes et la clarté des rapports nous ont permis d’améliorer considérablement notre service client.",
      image:
        "https://media.licdn.com/dms/image/v2/D4E03AQFeycNVysuZkQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1699795618556?e=2147483647&v=beta&t=QL8xjy1YFQ39FM4vBF5LCi8QNmmSlKp6ZTghyIkFuOM",
    },
  ];

  const faqs = [
    {
      question:
        "Comment PharmaStock aide-t-il à prévenir les ruptures de stock?",
      answer:
        "PharmaStock utilise des algorithmes avancés pour surveiller les niveaux de stock et prévoir la demande future. Le système vous alerte automatiquement lorsque les stocks atteignent un seuil prédéfini, vous permettant de réapprovisionner avant que les ruptures ne se produisent.",
    },
    {
      question:
        "Est-ce que PharmaStock est conforme aux réglementations pharmaceutiques?",
      answer:
        "Absolument. PharmaStock est conçu avec la conformité au cœur de son fonctionnement. Le système respecte les normes GDPR, HIPAA et autres réglementations pharmaceutiques pertinentes, assurant la sécurité et la confidentialité des données.",
    },
    {
      question: "Combien de temps faut-il pour implémenter PharmaStock?",
      answer:
        "La plupart de nos clients sont opérationnels en moins de deux semaines. Notre équipe d'experts vous guide à travers chaque étape du processus d'implémentation, de la configuration initiale à la formation du personnel.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Pills className="h-8 w-8 text-primary-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">
                Pharma<span className="text-primary-600">Stock</span>
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {[
                { name: "Fonctionnalités", href: "#fonctionnalites" },
                { name: "Avantages", href: "#avantages" },
                { name: "Témoignages", href: "#temoignages" },
                { name: "FAQ", href: "#faq" },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                >
                  {item.name}
                </a>
              ))}
            </nav>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:block bg-primary-600 text-white font-medium py-2 px-6 rounded-full hover:bg-primary-700 transition-colors shadow-md"
              onClick={() => navigate("login")}
            >
              Connexion
            </motion.button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                {[
                  { name: "Fonctionnalités", href: "#fonctionnalites" },
                  { name: "Avantages", href: "#avantages" },
                  { name: "Témoignages", href: "#temoignages" },
                  { name: "FAQ", href: "#faq" },
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 hover:text-primary-600 transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <button
                  className="bg-primary-600 text-white font-medium py-2 px-6 rounded-full hover:bg-primary-700 transition-colors shadow-md w-full"
                  onClick={() => alert("Fonctionnalité de connexion ici")}
                >
                  Connexion
                </button>
              </nav>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section id="hero" className="pt-28 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div
              className="md:w-1/2 mb-10 md:mb-0 md:pr-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
                Gestion Intelligente de Stock Médical
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Simplifiez le suivi de votre stock pharmaceutique avec notre
                système intelligent. Réduisez les erreurs, prévenez les pénuries
                et assurez la conformité.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary-600 text-white font-medium py-3 px-8 rounded-full hover:bg-primary-700 transition-colors shadow-md flex items-center justify-center"
                  onClick={() => navigate("login")}
                >
                  Commencer
                  <ArrowRight className="ml-2 h-5 w-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-gray-300 text-gray-700 font-medium py-3 px-8 rounded-full hover:border-primary-600 hover:text-primary-600 transition-colors flex items-center justify-center"
                  onClick={() => setShowDemo(true)}
                >
                  Voir la Démo
                </motion.button>
              </div>
            </motion.div>
            {showDemo && <VideoModel onClose={() => setShowDemo(false)} />}
            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="PharmaStock Dashboard"
                  className="w-full h-auto rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-600/20 to-transparent"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fonctionnalites" className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Fonctionnalités Puissantes pour la Gestion de Stock Médical
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Tout ce dont vous avez besoin pour gérer efficacement votre
              inventaire pharmaceutique
            </motion.p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow"
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="mb-4 bg-primary-50 p-3 rounded-lg w-fit">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section
        id="avantages"
        className="py-24 bg-gradient-to-br from-primary-600 to-primary-800 text-white"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Pourquoi Choisir PharmaStock?
            </motion.h2>
            <motion.p
              className="text-xl max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Découvrez comment notre solution transforme la gestion des stocks
              pharmaceutiques
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-primary-500 bg-opacity-20 p-4 rounded-full inline-flex items-center justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-primary-100">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="comment-ca-marche" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Comment Fonctionne PharmaStock?
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Un processus simple en trois étapes pour révolutionner votre
              gestion des stocks
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                step: 1,
                title: "Implémentation Facile",
                description:
                  "Notre équipe configure le système selon vos besoins spécifiques en quelques jours seulement.",
                icon: <CheckCircle className="h-8 w-8 text-white" />,
              },
              {
                step: 2,
                title: "Formation Complète",
                description:
                  "Nous formons votre équipe à l'utilisation optimale du système avec un support continu.",
                icon: <Headphones className="h-8 w-8 text-white" />,
              },
              {
                step: 3,
                title: "Optimisation Continue",
                description:
                  "Le système s'adapte automatiquement à vos besoins et s'améliore avec le temps.",
                icon: <MessageCircle className="h-8 w-8 text-white" />,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="relative mb-8">
                  <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                    {item.step}
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-primary-200">
                      <div className="w-3/4 h-full bg-primary-600"></div>
                    </div>
                  )}
                </div>
                <div className="bg-primary-600 p-3 rounded-full inline-flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="temoignages" className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Ce Que Disent Nos Clients
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Découvrez comment PharmaStock a transformé la gestion des stocks
              médicaux pour ces professionnels
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 p-8 rounded-xl shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-primary-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Questions Fréquemment Posées
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Tout ce que vous devez savoir sur notre système de gestion de
              stock pharmaceutique
            </motion.p>
          </div>

          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="mb-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <button
                  className={`flex justify-between items-center w-full text-left p-4 rounded-lg ${
                    activeAccordion === index
                      ? "bg-primary-600 text-white"
                      : "bg-white text-gray-900"
                  }`}
                  onClick={() => toggleAccordion(index)}
                >
                  <span className="font-medium">{faq.question}</span>
                  <span className="ml-2">
                    {activeAccordion === index ? (
                      <X className="h-5 w-5" />
                    ) : (
                      <motion.span
                        initial={{ rotate: 0 }}
                        animate={{ rotate: activeAccordion === index ? 90 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ArrowRight className="h-5 w-5" />
                      </motion.span>
                    )}
                  </span>
                </button>
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: activeAccordion === index ? "auto" : 0,
                    opacity: activeAccordion === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-white text-gray-600 rounded-b-lg">
                    {faq.answer}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-around  gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <Pills className="h-8 w-8 text-primary-400 mr-2" />
                <span className="text-xl font-bold">
                  Pharma<span className="text-primary-400">Stock</span>
                </span>
              </div>
              <p className="text-gray-400">
                Solution intelligente de gestion de stock pharmaceutique pour
                les hôpitaux et pharmacies modernes.
              </p>
            </div>
            <div >
              <h3 className="text-lg font-semibold mb-4">Société</h3>
              <ul className="space-y-2 ">
                {["À Propos",  "Contact"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-primary-400 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} PharmaStock. Tous droits
              réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
