import JobPost from '@/components/JobPost'; // adjust path if needed
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';


const Home = () => {
    
   const jobs = [
    {
        id: '1',
        companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png',
        jobTitle: 'Frontend Developer',
        companyName: 'TechCorp',
        location: 'Remote',
        timestamp: '2h ago',
        description: 'We are looking for a talented frontend developer to join our remote-first team and work on exciting projects.',
        jobImage: 'https://images.unsplash.com/photo-1551033406-611cf9a28f67',
        onApply: () => alert('Applied to Frontend Developer'),
    },
    {
        id: '2',
        companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
        jobTitle: 'UI/UX Designer',
        companyName: 'Designify',
        location: 'Cape Town, SA',
        timestamp: '1d ago',
        description: 'Join our creative design team and help shape user experiences for global clients.',
        onApply: () => alert('Applied to UI/UX Designer'),
    },
    {
        id: '3',
        companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
        jobTitle: 'Backend Engineer',
        companyName: 'CloudBase',
        location: 'Johannesburg, SA',
        timestamp: '3d ago',
        description: 'Build and maintain high-performance APIs and backend services for a fast-growing SaaS company.',
        jobImage: 'https://images.unsplash.com/photo-1581090700227-4c4d1b004114',
        onApply: () => alert('Applied to Backend Engineer'),
    },
    {
        id: '4',
        companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg',
        jobTitle: 'Data Scientist',
        companyName: 'DataWave',
        location: 'Remote',
        timestamp: '5h ago',
        description: 'Analyze large datasets to uncover trends and provide actionable business insights.',
        jobImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
        onApply: () => alert('Applied to Data Scientist'),
    },
    {
        id: '5',
        companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg',
        jobTitle: 'Mobile App Developer',
        companyName: 'Appify',
        location: 'Pretoria, SA',
        timestamp: '12h ago',
        description: 'Create engaging mobile experiences for both Android and iOS platforms.',
        onApply: () => alert('Applied to Mobile App Developer'),
    },
    {
        id: '6',
        companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png',
        jobTitle: 'Marketing Specialist',
        companyName: 'BrightReach',
        location: 'Durban, SA',
        timestamp: '2d ago',
        description: 'Plan and execute creative marketing campaigns that drive engagement and brand growth.',
        jobImage: 'https://images.unsplash.com/photo-1556761175-4b46a572b786',
        onApply: () => alert('Applied to Marketing Specialist'),
    },
    {
        id: '7',
        companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
        jobTitle: 'Product Manager',
        companyName: 'InnovaTech',
        location: 'Remote',
        timestamp: '4d ago',
        description: 'Lead product strategy and collaborate with cross-functional teams to bring products to life.',
        jobImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978',
        onApply: () => alert('Applied to Product Manager'),
    },
];

    return (
      
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            
          
            <ScrollView contentContainerStyle={styles.container}>
                
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 24 }}>
                    {/* Profile Icon */}
                    <TouchableOpacity>
                        <Ionicons name="person-circle-outline" size={32} color="#007AFF" />
                    </TouchableOpacity>
                    {/* Search Bar */}
                    <View style={{ flex: 1, marginHorizontal: 12 }}>
                        <TextInput
                            placeholder="Search jobs"
                            style={{
                                backgroundColor: '#f2f2f2',
                                borderRadius: 20,
                                paddingHorizontal: 16,
                                height: 36,
                            }}
                            placeholderTextColor="#888"
                        />
                    </View>
                    {/* Notifications Icon */}
                    <TouchableOpacity>
                        <Ionicons name="notifications-outline" size={28} color="#007AFF" />
                    </TouchableOpacity>
                </View>

                
                {/* Job Posts */}
                <View style={{ width: '100%', marginTop: 16 }}>
                    {jobs.map((job) => (
                        <JobPost key={job.id} {...job} />
                    ))}
                </View>
            </ScrollView>
        </View>
        
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 24,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 32,
        marginBottom: 12,
        color: '#222',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#555',
        marginBottom: 32,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 8,
        marginBottom: 16,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    buttonSecondary: {
        backgroundColor: '#f2f2f2',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 8,
        marginBottom: 32,
    },
    buttonSecondaryText: {
        color: '#007AFF',
        fontSize: 18,
        fontWeight: '600',
    },
    section: {
        width: '100%',
        marginTop: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 12,
        color: '#222',
    },
    categories: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    category: {
        backgroundColor: '#e6f0ff',
        color: '#007AFF',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
        fontSize: 16,
    },
});

export default Home;
