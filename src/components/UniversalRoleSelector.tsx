import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Search, Sparkles } from "lucide-react";
import { careerDomains, careerCategories, type CareerDomain } from "@/lib/careerDomains";
import { Input } from "@/components/ui/input";

interface UniversalRoleSelectorProps {
  selectedRole: string | null;
  onSelectRole: (roleId: string) => void;
}

const UniversalRoleSelector = ({ selectedRole, onSelectRole }: UniversalRoleSelectorProps) => {
  const [activeCategory, setActiveCategory] = useState("tech");
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const filteredDomains = searchQuery
    ? careerDomains.filter(d => 
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : careerDomains.filter(d => d.category === activeCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      }
    },
    exit: { opacity: 0, y: -20, scale: 0.95 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="w-full max-w-5xl mx-auto"
    >
      {/* Header with floating animation */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex items-center gap-2 mb-4"
        >
          <Sparkles className="w-6 h-6 text-primary" />
        </motion.div>
        <h2 className="text-2xl md:text-4xl font-bold mb-3">
          {"Select Your Target Career".split(" ").map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="inline-block mr-2"
            >
              {word}
            </motion.span>
          ))}
        </h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-muted-foreground"
        >
          Choose from 25+ career paths across tech, business, engineering & more
        </motion.p>
      </motion.div>

      {/* Animated Search */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: "spring" }}
        className="relative mb-6 max-w-md mx-auto"
      >
        <motion.div
          animate={{ 
            boxShadow: searchQuery 
              ? "0 0 20px hsl(262 83% 55% / 0.2)" 
              : "0 0 0px transparent" 
          }}
          className="relative"
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search careers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background/80 border-border backdrop-blur-sm transition-all focus:border-primary"
          />
        </motion.div>
      </motion.div>

      {/* Category tabs with pill animation */}
      {!searchQuery && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {careerCategories.map((cat, index) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              onClick={() => setActiveCategory(cat.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 overflow-hidden ${
                activeCategory === cat.id
                  ? "text-white shadow-lg"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
              }`}
            >
              {activeCategory === cat.id && (
                <motion.div
                  layoutId="activeCategory"
                  className={`absolute inset-0 bg-gradient-to-r ${cat.color}`}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat.label}</span>
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Career grid with staggered animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={searchQuery || activeCategory}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredDomains.map((domain, index) => {
            const Icon = domain.icon;
            const isSelected = selectedRole === domain.id;
            const isHovered = hoveredCard === domain.id;
            
            return (
              <motion.button
                key={domain.id}
                variants={itemVariants}
                onClick={() => onSelectRole(domain.id)}
                onHoverStart={() => setHoveredCard(domain.id)}
                onHoverEnd={() => setHoveredCard(null)}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={`relative p-5 rounded-xl text-left transition-all duration-300 overflow-hidden ${
                  isSelected
                    ? "glass-card border-2 border-primary shadow-[0_0_30px_hsl(262_83%_55%_/_0.2)]"
                    : "glass-card hover:border-primary/30"
                }`}
              >
                {/* Animated background gradient on hover */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered || isSelected ? 0.05 : 0 }}
                  className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary"
                />

                {/* Ripple effect on selection */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0.5 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 bg-primary rounded-full"
                    style={{ transformOrigin: "center" }}
                  />
                )}

                <div className="flex items-start gap-4 relative z-10">
                  <motion.div
                    animate={{ 
                      rotate: isHovered ? [0, -5, 5, 0] : 0,
                      scale: isSelected ? 1.1 : 1
                    }}
                    transition={{ duration: 0.4 }}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1 truncate">{domain.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{domain.description}</p>
                  </div>
                </div>

                {/* Selection indicator with pop animation */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                      className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-lg"
                    >
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: isHovered ? "100%" : "-100%" }}
                  transition={{ duration: 0.6 }}
                />
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {filteredDomains.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Search className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          </motion.div>
          <p className="text-muted-foreground">No careers found matching "{searchQuery}"</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UniversalRoleSelector;
