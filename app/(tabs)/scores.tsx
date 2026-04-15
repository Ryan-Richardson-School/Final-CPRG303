import React, {useCallback, useState} from "react";
//import { useCallback, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { COLORS, SHADOW, SIZES } from "../../constants/theme";
import { getQuizStats, QuizStats } from "../../utils/storage";
import { Ionicons } from "@expo/vector-icons";
import { nonnegative } from "zod";


const categories = [
    { title: "Canada", icon: "🍁", color: COLORS.category1 },
    { title: "Geography", icon: "🌍", color: COLORS.category2 },
    { title: "General Knowledge", icon: "🧠", color: COLORS.category3 },
    { title: "Dinosaurs", icon: "🦖", color: COLORS.category4 },
    { title: "Sharks", icon: "🦈", color: COLORS.category5 },
    { title: "Japan", icon: "🗾", color: COLORS.category6 },
];
const rankInfo= (score:number) => {
    if (score===0)
        return {title:"Getting Started", icon: "star-outline",color:"#94a3b8"}
    if (score >= 1 && score <= 30) 
        return {title:"Bronze", icon:"ribbon", color:"#cd7f32"}
    if (score >= 31 && score <= 45)
        return {title:"Silver", icon:"medal", color: "#c0c0c0"}
    return{title:"Gold", icon:"trophy", color: "#ffd700"}
}



export default function Scores() {
    const [stats, setStats] = useState<QuizStats | null>(null);

    //total best scores
    const totalBestScore = categories.reduce((sum, categories)=>{
        return sum + (stats?.bestScores?.[categories.title] ||0);} ,0);
    
    const rank = rankInfo(totalBestScore);
    

    const loadStats = useCallback(async () => {
        const savedStats = await getQuizStats();
        setStats(savedStats);
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadStats();
        }, [loadStats])
    );

    return(
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>

            <Text style={styles.headerText}>Overall Rank</Text>
            <Text style={styles.subHeaderText}>Your Cumulative Total</Text>


            <View style={[styles.rankCard]}>
                <View style={[styles.rankBadge]}>
                    <Ionicons name={rank.icon as any} size={30} color={rank.color}/>
                </View>
                <View>
                    <Text style={styles.rankLabel}>Current Rank</Text>
                    <Text style={[styles.categoryTitle,{color: rank.color,marginBottom:0}]}>{rank.title}</Text>
                    <Text style={styles.totalPointsText}>{totalBestScore} Total Points out of 60</Text>
                </View>
            </View>


            <Text style={styles.headerText}>Personal Best Scores</Text>
            <Text style={styles.subHeaderText}>Your highest score per category</Text>

            <View style={styles.list}>
                {categories.map((category) => {
                    const bestScore = stats?.bestScores?.[category.title] || 0;
                    
                    return (
                        <View key={category.title} style={styles.scoreCard}>
                            <View style={[styles.iconBox, { backgroundColor: category.color }]}>
                                <Text style={styles.iconText}>{category.icon}</Text>
                            </View>

                            <View style={styles.info}>
                                <Text style={styles.categoryTitle}>{category.title}</Text>
                                <View style={styles.progressBarBg}> 
                                    <View 
                                        style={[
                                            styles.progressFill,
                                            { width: `${(bestScore / 10) * 100}%`, backgroundColor: category.color }]} 
                                    />
                                </View>
                            </View>

                            <View style={styles.scoreBadge}>
                                <Text style={styles.scoreNumber}>{bestScore}</Text>
                                <Text style={styles.scoreTotal}>/10</Text>
                            </View>


                                            
                        </View>
                    );
                })}
            </View>
        </ScrollView>

    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: SIZES.padding,
        paddingTop: 60,
    },
    rankCard:{
        backgroundColor:COLORS.white,
        borderRadius:25,
        padding:20,
        flexDirection:'row',
        alignItems:'center',
        marginBottom: 30,
        ...SHADOW,

    },
    rankBadge: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 20,
    },
    rankLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: "gray",
        textTransform: "uppercase",
        letterSpacing: 1,
    },

    totalPointsText: {
        fontSize: 14,
        color: "gray",
        fontWeight: "500",
    },

    headerText: {
        fontSize: 28,
        fontWeight: "800",
        color: COLORS.primaryDark,
        marginBottom: 4,
    },
    subHeaderText: {
        fontSize: 16,
        color: "gray",
        marginBottom: 24,
    },
    list: {
        flexDirection: "column",
        gap: 16,
    },
    scoreCard: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        ...SHADOW,
        },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    iconText: {
        fontSize: 24,
    },
    info: {
        flex: 1,
        paddingHorizontal: 15,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.primaryDark,
        marginBottom: 6,
        },
    progressBarBg: {
        width: "100%",
        height: 10,
        backgroundColor: COLORS.card,
        borderRadius: 5,
        overflow: "hidden",
        },
    progressFill: {
        height: "100%",
        borderRadius: 5,
        },
    scoreBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.card,
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
        },
    scoreNumber: {
        fontSize: 18,
        fontWeight: "800",
        color: COLORS.primaryDark,
        },
    scoreTotal: {
        fontSize: 14,
        color: COLORS.primaryDark + "80",
        marginLeft: 4,
    },
    });