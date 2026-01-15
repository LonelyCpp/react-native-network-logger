import React, { useState, useEffect } from 'react';
import {
  View,
  Share,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import NetworkRequestInfo from '../NetworkRequestInfo';
import { useThemedStyles, Theme } from '../theme';
import { backHandlerSet } from '../backHandler';
import ResultItem from './ResultItem';
import Header from './Header';
import Button from './Button';
import ThemedText from './ThemedText';
import HttpHeaders from './HttpHeaders';
import LargeText from './LargeText';
import NLModal from './Modal';

interface Props {
  request: NetworkRequestInfo;
  onClose(): void;
}

const RequestDetails: React.FC<Props> = ({ request, onClose }) => {
  const [responseBody, setResponseBody] = useState('Loading...');
  const styles = useThemedStyles(themedStyles);
  const [modalVisible, setModalVisible] = useState(false);

  const [selectedTab, setSelectedTab] = useState<
    'response' | 'request' | 'headers'
  >('response');

  useEffect(() => {
    request.getResponseBody().then((body) => {
      setResponseBody(body);
    });
  }, [request]);

  const requestBody = request.getRequestBody(!!request.gqlOperation);

  const getFullRequest = () => {
    let response;
    if (responseBody) {
      try {
        response = JSON.parse(responseBody);
      } catch {
        response = `${responseBody}`;
      }
    }
    const processedRequest = {
      ...request,
      response,
      duration: request.duration,
    };
    return JSON.stringify(processedRequest, null, 2);
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <ResultItem
            request={request}
            style={styles.info}
            numberOfLines={5}
            onPress={() => {
              setModalVisible(true);
            }}
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        {!backHandlerSet() && <Button onPress={onClose}>Close</Button>}

        <Button
          onPress={() =>
            Share.share({
              message: `\`\`\`\n${request.curlRequest}\n\`\`\``,
            })
          }
        >
          Share cURL
        </Button>
        <Button
          onPress={() =>
            Share.share({ message: `\`\`\`\n${getFullRequest()}\n\`\`\`` })
          }
        >
          Share full request
        </Button>
      </View>

      <View style={styles.tabButtonContainer}>
        <TouchableOpacity
          style={[
            styles.tabHeader,
            selectedTab === 'response' && styles.tabHeaderActive,
          ]}
          onPress={() => setSelectedTab('response')}
        >
          <ThemedText>Response</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabHeader,
            selectedTab === 'request' && styles.tabHeaderActive,
          ]}
          onPress={() => setSelectedTab('request')}
        >
          <ThemedText>Request</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabHeader,
            selectedTab === 'headers' && styles.tabHeaderActive,
          ]}
          onPress={() => setSelectedTab('headers')}
        >
          <ThemedText>Headers</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} nestedScrollEnabled>
        {selectedTab === 'headers' && (
          <>
            <HttpHeaders
              title="Request Headers"
              headers={request.requestHeaders}
            />

            <HttpHeaders
              title="Response Headers"
              headers={request.responseHeaders}
            />
          </>
        )}

        {selectedTab === 'request' && (
          <>
            <Header shareContent={requestBody}>Request Body</Header>
            <View style={styles.bodyContainer}>
              <LargeText>{requestBody}</LargeText>
            </View>

            <HttpHeaders
              title="Request Query Params"
              headers={Object.fromEntries(
                Array.from(request.getParsedUrl().searchParams.entries()).map(
                  ([key, value]) => {
                    try {
                      const parsed = JSON.parse(value);
                      return [
                        key,
                        Array.isArray(parsed) ? parsed.join(', ') : value,
                      ];
                    } catch {
                      return [key, value];
                    }
                  }
                )
              )}
            />
          </>
        )}

        {selectedTab === 'response' && (
          <>
            <Header shareContent={responseBody}>Response Body</Header>
            <View style={styles.bodyContainer}>
              <LargeText>{responseBody}</LargeText>
            </View>
          </>
        )}
      </ScrollView>

      <NLModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <View style={styles.urlModalContainer}>
          <ScrollView>
            <ThemedText style={styles.urlModalText}>{request.url}</ThemedText>
          </ScrollView>
        </View>
      </NLModal>
    </View>
  );
};

const themedStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      paddingBottom: 10,
    },
    tabHeader: {
      padding: 8,
      margin: 8,
      backgroundColor: theme.colors.card,
    },
    tabHeaderActive: {
      backgroundColor: theme.colors.statusGood,
    },
    info: {
      margin: 0,
    },
    scrollView: {
      width: '100%',
    },
    headerContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    headerKey: { fontWeight: 'bold', color: theme.colors.text },
    headerValue: { color: theme.colors.text },
    text: {
      fontSize: 16,
      color: theme.colors.text,
    },
    content: {
      backgroundColor: theme.colors.card,
      padding: 10,
      color: theme.colors.text,
    },
    bodyContainer: {
      backgroundColor: theme.colors.card,
      padding: 8,
    },
    urlModalContainer: {
      maxHeight: 300,
    },
    urlModalText: {
      fontSize: 12,
    },
    buttonContainer: {
      gap: 8,
      padding: 8,
      flexDirection: 'row',
      flexWrap: 'wrap',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.card,
    },
    tabButtonContainer: {
      paddingBottom: 4,
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.card,
    },
  });

export default RequestDetails;
