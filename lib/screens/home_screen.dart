import 'package:flutter/material.dart';
import 'package:flutter_docs_app/colors.dart';
import 'package:flutter_docs_app/common/widgets/loader.dart';
import 'package:flutter_docs_app/models/document_model.dart';
import 'package:flutter_docs_app/repository/auth_repository.dart';
import 'package:flutter_docs_app/repository/document_repository.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:routemaster/routemaster.dart';

// since reading from riverpod so use consumerWidger
class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  void signOut(WidgetRef ref) {
    ref.read(authRepositoryProvider).signOut();
    ref.read(userProvider.notifier).update((state) => null);
  }

  void createDocument(BuildContext context, WidgetRef ref) async {
    String token = ref.read(userProvider)!.token;
    final navigator = Routemaster.of(context);
    final snackbar = ScaffoldMessenger.of(context);

    final errorModel =
        await ref.read(documentRepositoruProvider).createDocument(token);

    if (errorModel.data != null) {
      navigator.push('/document/${errorModel.data.id}');
    } else {
      snackbar.showSnackBar(
        SnackBar(
          content: Text(errorModel.error!),
        ),
      );
    }
  }

  void navigateToDocument(BuildContext context, String documentId) {
    Routemaster.of(context).push('/document/$documentId');
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
        appBar: AppBar(backgroundColor: kWhiteColor, elevation: 0, actions: [
          IconButton(
            onPressed: () => createDocument(context, ref),
            icon: const Icon(
              Icons.add,
              color: kBlackColor,
            ),
          ),
          IconButton(
            onPressed: () => signOut(ref),
            icon: const Icon(
              Icons.logout,
              color: kRedColor,
            ),
          ),
        ]),
        body: FutureBuilder(
          future: ref
              .watch(documentRepositoruProvider)
              .getDocuments(ref.watch(userProvider)!.token),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Loader();
            }

            // there is problem in below code, Listview buider is not working
            return Center(
              //for centering card
              child: Container(
                //for width of cards
                width: 600,
                margin: const EdgeInsets.only(top: 10),
                child: ListView.builder(
                    itemCount: snapshot.data!.data.length,
                    itemBuilder: (context, index) {
                      DocumentModel document = snapshot.data!.data[index];

                      return InkWell(
                        onTap: () => navigateToDocument(context, document.id),
                        child: SizedBox(
                          //for height of card
                          height: 50,
                          child: Card(
                            child: Center(
                              child: Text(
                                document.title,
                                style: const TextStyle(fontSize: 17),
                              ),
                            ),
                          ),
                        ),
                      );
                    }),
              ),
            );
          },
        ));
  }
}